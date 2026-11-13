package com.campus.placement;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

/* Business rules for the placement app. The controller calls these methods;
   these methods call the repositories. */
@Service
public class PlacementService {

    private static final DateTimeFormatter APPLIED_ON_FORMAT =
            DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final AdminTaskRepository adminTaskRepository;
    private final ApplicationRoundRepository applicationRoundRepository;

    public PlacementService(UserRepository userRepository,
                            StudentRepository studentRepository,
                            JobPostingRepository jobPostingRepository,
                            JobApplicationRepository jobApplicationRepository,
                            AdminTaskRepository adminTaskRepository,
                            ApplicationRoundRepository applicationRoundRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.adminTaskRepository = adminTaskRepository;
        this.applicationRoundRepository = applicationRoundRepository;
    }

    /** Finds the user by alias, or registers them on their first sign-in.
        A new student also gets an empty profile to fill in. Admin accounts
        are never created here - they are seeded - and an admin account can
        only sign in as an admin, so neither side can cross into the other. */
    public User login(String alias, String role) {
        User user = userRepository.findByAlias(alias).orElse(null);
        boolean isAdmin = user != null && "admin".equals(user.getRole());
        if ("admin".equals(role) && !isAdmin) {
            throw new AccessDeniedException(alias + " is not an admin account");
        }
        if (isAdmin && !"admin".equals(role)) {
            throw new AccessDeniedException("Admin accounts must sign in through the Admin tab");
        }

        if (user == null) {
            user = userRepository.save(new User(alias, role));
        } else if (!role.equals(user.getRole())) {
            user.setRole(role);
            user = userRepository.save(user);
        }

        if ("student".equals(role) && studentRepository.findByUserId(user.getId()).isEmpty()) {
            studentRepository.save(new Student(user.getId(), "New Student", alias, "CSE", 0, 0, 2027, ""));
        }
        return user;
    }

    /** Lets the call through only when callerId belongs to a user with the
        given role. callerId comes from the X-User-Id header. */
    public void requireRole(Long callerId, String role) {
        User caller = callerId == null ? null : userRepository.findById(callerId).orElse(null);
        if (caller == null || !role.equals(caller.getRole())) {
            throw new AccessDeniedException("This action needs a signed-in " + role + " account");
        }
    }

    /** Lets the call through only when the caller is the owner of the data. */
    public void requireSelf(Long callerId, Long ownerId) {
        if (callerId == null || !callerId.equals(ownerId)) {
            throw new AccessDeniedException("You can only access your own records");
        }
    }

    /** Owner check for routes that only carry an application id. */
    public void requireApplicationOwner(Long callerId, Long applicationId) {
        jobApplicationRepository.findById(applicationId)
                .ifPresent(application -> requireSelf(callerId, application.getUserId()));
    }

    public List<JobPosting> getJobs() {
        return jobPostingRepository.findAll();
    }

    public Student getProfile(Long userId) {
        return studentRepository.findByUserId(userId).orElse(null);
    }

    /** Copies the editable fields onto the stored profile and saves it -
        save() on an entity that already has an id is an update. */
    public Student updateProfile(Long userId, Student changes) {
        Student student = studentRepository.findByUserId(userId).orElse(null);
        if (student == null) {
            return null;
        }
        student.setName(changes.getName());
        student.setBranch(changes.getBranch());
        student.setCgpa(changes.getCgpa());
        student.setBacklogs(changes.getBacklogs());
        student.setGradYear(changes.getGradYear());
        student.setSkills(changes.getSkills());
        return studentRepository.save(student);
    }

    public List<JobApplication> getApplications(Long userId) {
        return jobApplicationRepository.findByUserId(userId);
    }

    /** Checks the application the way checkAttempt() checks an answer, then
        saves it. Throws with a readable message when it is not allowed. */
    public JobApplication apply(Long userId, Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("No job posting with id " + jobId));
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Only students can apply to postings"));

        if (jobApplicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new IllegalStateException("Already applied to " + job.getCompany() + " - " + job.getRole());
        }
        if (!job.isOpenTo(student.getBranch())) {
            throw new IllegalStateException(job.getCompany() + " is not open to " + student.getBranch() + " students");
        }

        String today = LocalDate.now().format(APPLIED_ON_FORMAT);
        JobApplication application = new JobApplication(
                null, userId, jobId, job.getCompany(), job.getRole(), today, "Applied");
        JobApplication saved = jobApplicationRepository.save(application);
        createRounds(saved, job);
        return saved;
    }

    /** The selection rounds of one application, in order. Returns null when
        the application does not exist, so the controller can answer 404. */
    public List<ApplicationRound> getRounds(Long applicationId) {
        if (!jobApplicationRepository.existsById(applicationId)) {
            return null;
        }
        return applicationRoundRepository.findByApplicationIdOrderBySequenceAsc(applicationId);
    }

    /** Lays out the selection process for an application and saves one row
        per step. How far the steps have progressed follows the application's
        status: Applied waits on the online assessment, Shortlisted waits on
        the first technical interview, Selected has cleared every step, and
        Rejected stops at one of the middle rounds. Each reached step is dated
        a week after the previous one. */
    public void createRounds(JobApplication application, JobPosting job) {
        List<String> names = roundNamesFor(job);
        int last = names.size() - 1;

        int current = switch (application.getStatus()) {
            case "Shortlisted" -> 2;
            case "Selected" -> names.size();
            // Spread rejections across the assessment and interview rounds.
            case "Rejected" -> 1 + (int) (application.getId() % (last - 1));
            default -> 1;
        };
        boolean rejected = "Rejected".equals(application.getStatus());
        LocalDate appliedOn = LocalDate.parse(application.getAppliedOn(), APPLIED_ON_FORMAT);

        for (int step = 0; step <= last; step++) {
            String status;
            if (step < current) {
                status = "Cleared";
            } else if (step == current) {
                status = rejected ? "Rejected" : "Scheduled";
            } else {
                status = rejected ? "Not Reached" : "Upcoming";
            }
            String date = step <= current
                    ? appliedOn.plusWeeks(step).format(APPLIED_ON_FORMAT)
                    : "";
            applicationRoundRepository.save(
                    new ApplicationRound(application.getId(), step, names.get(step), status, date));
        }
    }

    /** Product companies hold two technical interviews; the rest hold one. */
    private static List<String> roundNamesFor(JobPosting job) {
        if ("Product Companies".equals(job.getCategory())) {
            return List.of("Application Submitted", "Online Assessment", "Technical Interview 1",
                    "Technical Interview 2", "HR Interview", "Offer");
        }
        return List.of("Application Submitted", "Online Assessment", "Technical Interview",
                "HR Interview", "Offer");
    }

    public List<AdminTask> getAdminTasks() {
        return adminTaskRepository.findAll();
    }

    public AdminTask resolveTask(Long taskId, String remark) {
        AdminTask task = adminTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("No admin task with id " + taskId));
        if (task.getPending() <= 0) {
            throw new IllegalStateException("No pending items for " + task.getTask());
        }
        task.setPending(task.getPending() - 1);
        task.setLastRemark(remark);
        return adminTaskRepository.save(task);
    }
}
