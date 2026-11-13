package com.campus.placement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/* Runs once at startup. The in-memory database starts empty every time, so
   this first demonstrates the repository operations from the unit on a
   throwaway user, then loads the placement data the React app shows.

   Expanded dataset: ~18 real top-500 companies, ~100 students, ~250+ applications. */
@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final AdminTaskRepository adminTaskRepository;
    private final PlacementService placementService;

    public DataLoader(UserRepository userRepository,
                      StudentRepository studentRepository,
                      JobPostingRepository jobPostingRepository,
                      JobApplicationRepository jobApplicationRepository,
                      AdminTaskRepository adminTaskRepository,
                      PlacementService placementService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.adminTaskRepository = adminTaskRepository;
        this.placementService = placementService;
    }

    @Override
    public void run(String... args) {
        demonstrateUserRepository();
        loadPlacementData();
        demonstrateQueryMethods();
    }

    /** Save, read, update, find by id and delete - one after another. */
    private void demonstrateUserRepository() {
        System.out.println("--- UserRepository demo ---");

        User user = new User("Ganesh", "student");
        userRepository.save(user);
        userRepository.findAll().forEach(savedUser ->
                System.out.println(savedUser.getId() + " - " + savedUser.getAlias()));

        System.out.println("Before update: " + user.getAlias());
        user.setAlias("Ganesh Kumar");
        userRepository.save(user);
        System.out.println("After update: " + user.getAlias());

        Long userId = user.getId();
        userRepository.findById(userId).ifPresent(foundUser ->
                System.out.println("Found user: " + foundUser.getId() + " - " + foundUser.getAlias()));

        userRepository.delete(user);
        System.out.println("Remaining users: " + userRepository.count());
    }

    /** Expanded placement data: 18 real companies, 100 students, 250+ applications. */
    private void loadPlacementData() {

        // ======================================================================
        // STUDENTS  (100 students across CSE, IT, ECE, EEE, MECH, AI & DS)
        // ======================================================================
        String[][] studentData = {
            // { registerNumber, name, branch, cgpa, backlogs, gradYear, skills }
            {"RA2211026010123", "Daksh P.",              "CSE",     "9.44", "0", "2027", "React, Node.js, FastAPI, scikit-learn"},
            {"RA2211026010101", "Aarav Sharma",          "CSE",     "9.12", "0", "2027", "Java, Spring Boot, React, MySQL"},
            {"RA2211026010102", "Vihaan Reddy",          "CSE",     "8.87", "0", "2027", "Python, Django, PostgreSQL, Docker"},
            {"RA2211026010103", "Ananya Iyer",           "CSE",     "9.51", "0", "2027", "C++, Algorithms, Competitive Programming, ML"},
            {"RA2211026010104", "Sai Krishna",           "CSE",     "7.93", "1", "2027", "JavaScript, React, MongoDB, Express"},
            {"RA2211026010105", "Meera Nair",            "CSE",     "8.65", "0", "2027", "Python, TensorFlow, NLP, Data Science"},
            {"RA2211026010106", "Rohan Gupta",           "CSE",     "7.22", "2", "2027", "Java, Android, Firebase, Kotlin"},
            {"RA2211026010107", "Priya Deshmukh",        "CSE",     "9.03", "0", "2027", "C#, .NET, Azure, SQL Server"},
            {"RA2211026010108", "Arjun Mehta",           "CSE",     "8.45", "0", "2027", "Python, FastAPI, AWS, Terraform"},
            {"RA2211026010109", "Kavya Srinivasan",      "CSE",     "8.11", "1", "2027", "React, TypeScript, GraphQL, Node.js"},
            {"RA2211026010110", "Aditya Joshi",          "CSE",     "9.28", "0", "2027", "Go, Kubernetes, Docker, Microservices"},
            {"RA2211026010111", "Nithya Raman",          "CSE",     "7.56", "1", "2027", "HTML, CSS, JavaScript, PHP, Laravel"},
            {"RA2211026010112", "Harish Venkat",         "CSE",     "8.90", "0", "2027", "Rust, Systems Programming, Linux, C"},
            {"RA2211026010113", "Divya Prasad",          "CSE",     "8.33", "0", "2027", "Flutter, Dart, Firebase, REST APIs"},
            {"RA2211026010114", "Karthik Subramanian",   "CSE",     "7.80", "1", "2027", "Python, Pandas, Power BI, SQL"},
            {"RA2211026010115", "Shreya Kulkarni",       "CSE",     "9.67", "0", "2027", "C++, Algorithms, Distributed Systems, DBMS"},
            {"RA2211026010116", "Varun Bhat",            "CSE",     "6.89", "2", "2027", "HTML, CSS, Bootstrap, jQuery"},
            {"RA2211026010117", "Lakshmi Menon",         "CSE",     "8.22", "0", "2027", "Java, Spring, Hibernate, Redis"},

            // IT students
            {"RA2211026020101", "Ravi Shankar",          "IT",      "8.55", "0", "2027", "Python, Flask, PostgreSQL, Docker"},
            {"RA2211026020102", "Neha Agarwal",          "IT",      "9.10", "0", "2027", "Java, AWS, Microservices, Kafka"},
            {"RA2211026020103", "Suresh Babu",           "IT",      "7.78", "1", "2027", "JavaScript, Vue.js, Node.js, MongoDB"},
            {"RA2211026020104", "Pooja Verma",           "IT",      "8.41", "0", "2027", "React, Redux, TypeScript, Jest"},
            {"RA2211026020105", "Vikram Singh",          "IT",      "7.12", "2", "2027", "PHP, WordPress, MySQL, CSS"},
            {"RA2211026020106", "Deepa Krishnan",        "IT",      "8.95", "0", "2027", "Python, Django, Celery, RabbitMQ"},
            {"RA2211026020107", "Rahul Das",             "IT",      "7.45", "1", "2027", "C, Embedded Systems, Arduino, IoT"},
            {"RA2211026020108", "Swathi Sundar",         "IT",      "8.73", "0", "2027", "Angular, TypeScript, RxJS, .NET Core"},
            {"RA2211026020109", "Manoj Kumar",           "IT",      "6.55", "3", "2027", "HTML, CSS, Basic Python, Excel"},
            {"RA2211026020110", "Ishita Banerjee",       "IT",      "9.33", "0", "2027", "Go, gRPC, Kubernetes, Prometheus"},
            {"RA2211026020111", "Pranav Pillai",         "IT",      "8.02", "0", "2027", "Java, Selenium, CI/CD, Jenkins"},
            {"RA2211026020112", "Anjali Mishra",         "IT",      "7.89", "1", "2027", "React, Next.js, Tailwind, Prisma"},
            {"RA2211026020113", "Siddharth Rao",         "IT",      "8.60", "0", "2027", "Python, Scikit-learn, Matplotlib, SQL"},
            {"RA2211026020114", "Ritika Saxena",         "IT",      "7.34", "1", "2027", "C++, Data Structures, Algorithms, OOP"},
            {"RA2211026020115", "Gopal Nath",            "IT",      "8.15", "0", "2027", "Ruby, Rails, PostgreSQL, Heroku"},

            // ECE students
            {"RA2211026030101", "Ashwin Raj",            "ECE",     "8.30", "0", "2027", "Embedded C, VHDL, MATLAB, PCB Design"},
            {"RA2211026030102", "Radhika Patel",         "ECE",     "7.99", "1", "2027", "Python, Signal Processing, Arduino, IoT"},
            {"RA2211026030103", "Kiran Hegde",           "ECE",     "8.67", "0", "2027", "C, RTOS, ARM Cortex, Verilog"},
            {"RA2211026030104", "Tanvi Shetty",          "ECE",     "9.05", "0", "2027", "VLSI Design, Cadence, SPICE, SystemVerilog"},
            {"RA2211026030105", "Nikhil Yadav",          "ECE",     "7.40", "2", "2027", "C++, Simulink, MATLAB, LabVIEW"},
            {"RA2211026030106", "Aparna Nambiar",        "ECE",     "8.88", "0", "2027", "Python, OpenCV, Raspberry Pi, TensorFlow Lite"},
            {"RA2211026030107", "Vijay Anand",           "ECE",     "7.15", "1", "2027", "Embedded Linux, Yocto, Device Drivers, C"},
            {"RA2211026030108", "Bhavani Devi",          "ECE",     "8.50", "0", "2027", "FPGA, Xilinx, HDL, Digital Electronics"},
            {"RA2211026030109", "Ganesh Moorthy",        "ECE",     "6.72", "3", "2027", "Basic C, Electronics, Circuit Design"},
            {"RA2211026030110", "Ramya Sundaram",        "ECE",     "8.10", "0", "2027", "MATLAB, Antenna Design, RF Engineering, 5G"},

            // EEE students
            {"RA2211026040101", "Sanjay Kumar",          "EEE",     "8.44", "0", "2027", "Power Electronics, MATLAB, Simulink, PLC"},
            {"RA2211026040102", "Padma Lakshmi",         "EEE",     "7.88", "1", "2027", "AutoCAD Electrical, SCADA, Industrial IoT"},
            {"RA2211026040103", "Arun Prakash",          "EEE",     "8.72", "0", "2027", "Python, PSCAD, Renewable Energy, HVDC"},
            {"RA2211026040104", "Gayathri Devi",         "EEE",     "9.15", "0", "2027", "C, Embedded Systems, Motor Drives, DSP"},
            {"RA2211026040105", "Dinesh Raj",            "EEE",     "7.05", "2", "2027", "Basic MATLAB, Circuit Analysis, Transformers"},
            {"RA2211026040106", "Revathi Narayan",       "EEE",     "8.33", "0", "2027", "Python, Machine Learning, Smart Grid, IoT"},
            {"RA2211026040107", "Prabhu Deva",           "EEE",     "7.60", "1", "2027", "PLC, DCS, Instrumentation, Process Control"},
            {"RA2211026040108", "Saranya Mohan",         "EEE",     "8.90", "0", "2027", "MATLAB, Power Systems, Protection, Relay"},

            // MECH students
            {"RA2211026050101", "Rajesh Kannan",         "MECH",    "8.20", "0", "2027", "SolidWorks, AutoCAD, CATIA, GD&T"},
            {"RA2211026050102", "Sowmya Rani",           "MECH",    "7.76", "1", "2027", "ANSYS, CFD, Thermodynamics, FEA"},
            {"RA2211026050103", "Kishore Kumar",         "MECH",    "8.55", "0", "2027", "CNC Programming, CAM, Lean Manufacturing"},
            {"RA2211026050104", "Lavanya Priya",         "MECH",    "9.01", "0", "2027", "Python, MATLAB, Robotics, ROS"},
            {"RA2211026050105", "Balaji Srinivasan",     "MECH",    "7.30", "2", "2027", "AutoCAD, Creo, Basic Manufacturing"},
            {"RA2211026050106", "Janani Ramesh",         "MECH",    "8.48", "0", "2027", "3D Printing, Product Design, Six Sigma"},
            {"RA2211026050107", "Senthil Murugan",       "MECH",    "6.95", "2", "2027", "Workshop Practice, Metrology, Casting"},
            {"RA2211026050108", "Nandini Krishnan",      "MECH",    "8.77", "0", "2027", "MATLAB, Simulink, Vehicle Dynamics, EV Design"},

            // AI & DS students
            {"RA2211026060101", "Abishek Rajan",         "AI & DS", "9.35", "0", "2027", "Python, PyTorch, Deep Learning, NLP, Transformers"},
            {"RA2211026060102", "Sneha Mohan",           "AI & DS", "8.80", "0", "2027", "Python, TensorFlow, Computer Vision, OpenCV"},
            {"RA2211026060103", "Vivek Chandran",        "AI & DS", "8.45", "0", "2027", "R, Python, Statistical Modeling, Time Series"},
            {"RA2211026060104", "Krithika Bala",         "AI & DS", "9.60", "0", "2027", "Python, LLMs, RAG, LangChain, Hugging Face"},
            {"RA2211026060105", "Naveen Prashanth",      "AI & DS", "7.90", "1", "2027", "SQL, Tableau, Python, Data Analytics"},
            {"RA2211026060106", "Dharani Dharan",        "AI & DS", "8.15", "0", "2027", "Python, Spark, Hadoop, Data Engineering"},
            {"RA2211026060107", "Akshaya Kumari",        "AI & DS", "7.55", "1", "2027", "Python, Scikit-learn, EDA, Pandas"},
            {"RA2211026060108", "Surya Narayanan",       "AI & DS", "9.18", "0", "2027", "Python, MLOps, Kubernetes, MLflow, AWS SageMaker"},
            {"RA2211026060109", "Keerthana Vijay",       "AI & DS", "8.65", "0", "2027", "Python, GANs, Reinforcement Learning, JAX"},
            {"RA2211026060110", "Hari Prasad",           "AI & DS", "7.20", "2", "2027", "Python, Basic ML, NumPy, Matplotlib"},

            // More CSE for variety (different grad years)
            {"RA2211026010201", "Nitin Saxena",          "CSE",     "8.05", "0", "2026", "Java, Hibernate, Spring Boot, MySQL"},
            {"RA2211026010202", "Pallavi Sharma",        "CSE",     "7.60", "1", "2026", "Python, Flask, REST APIs, Git"},
            {"RA2211026010203", "Mohan Raj",             "CSE",     "9.20", "0", "2026", "C++, Systems Design, OS, Networks"},
            {"RA2211026010204", "Yamini Krishnamurthy",  "CSE",     "8.75", "0", "2026", "Scala, Spark, Kafka, Flink"},
            {"RA2211026010205", "Saravanan Murugan",     "CSE",     "7.40", "1", "2026", "JavaScript, Express, Socket.io, React"},

            // More IT
            {"RA2211026020201", "Abhinav Tiwari",        "IT",      "8.30", "0", "2026", "DevOps, AWS, Terraform, Ansible"},
            {"RA2211026020202", "Charulata Hegde",       "IT",      "9.45", "0", "2026", "Full Stack, MERN, GraphQL, Docker"},
            {"RA2211026020203", "Farhan Khan",           "IT",      "7.70", "1", "2026", "Android, Kotlin, Room DB, Retrofit"},

            // More ECE
            {"RA2211026030201", "Deepthi Nair",          "ECE",     "8.82", "0", "2026", "VLSI, Synopsys, STA, Physical Design"},
            {"RA2211026030202", "Jayakumar Selvan",      "ECE",     "7.55", "1", "2026", "Embedded C, RTOS, ARM, BLE"},

            // More AI & DS
            {"RA2211026060201", "Shruthi Bhat",          "AI & DS", "9.50", "0", "2026", "Python, GPT Fine-tuning, RLHF, Distributed Training"},
            {"RA2211026060202", "Tejas Kamat",           "AI & DS", "8.10", "0", "2026", "Python, Data Visualization, Streamlit, SQL"},

            // Additional CSE 2028 batch
            {"RA2211026010301", "Isha Malhotra",         "CSE",     "8.95", "0", "2028", "Rust, WebAssembly, WASM, Linux Kernel"},
            {"RA2211026010302", "Ojas Puri",             "CSE",     "7.85", "0", "2028", "Python, Django, Celery, Redis"},
            {"RA2211026010303", "Tanishq Agarwal",       "CSE",     "8.40", "0", "2028", "Java, Quarkus, GraalVM, Microprofile"},
            {"RA2211026010304", "Riya Chopra",           "CSE",     "9.10", "0", "2028", "C++, CUDA, GPU Programming, HPC"},

            // Additional IT 2028 batch
            {"RA2211026020301", "Manish Pandey",         "IT",      "7.50", "1", "2028", "Python, Automation, Selenium, Pytest"},
            {"RA2211026020302", "Simran Kaur",           "IT",      "8.65", "0", "2028", "React Native, Expo, Firebase, Redux"},

            // Additional AI & DS 2028 batch
            {"RA2211026060301", "Aryan Kapoor",          "AI & DS", "9.30", "0", "2028", "Python, Vision Transformers, Diffusion Models, CLIP"},
            {"RA2211026060302", "Zara Sheikh",           "AI & DS", "8.55", "0", "2028", "Python, Graph Neural Networks, Neo4j, NetworkX"},

            // Extra students to reach ~100
            {"RA2211026010305", "Dev Trivedi",           "CSE",     "7.10", "2", "2028", "HTML, CSS, JavaScript, Bootstrap"},
            {"RA2211026050201", "Akash Mishra",          "MECH",    "8.60", "0", "2026", "SolidWorks, ANSYS, CFD, Python"},
            {"RA2211026040201", "Bhargavi Rao",          "EEE",     "8.25", "0", "2026", "MATLAB, Power Systems, PLC, SCADA"},
            {"RA2211026030203", "Chetan Gowda",          "ECE",     "7.80", "0", "2028", "Embedded Linux, Yocto, BLE, Zigbee"},
            {"RA2211026050202", "Deepika Jain",          "MECH",    "8.05", "0", "2028", "Additive Manufacturing, CAD, Industry 4.0"},
        };

        // Create User + Student for each entry
        List<User> studentUsers = new ArrayList<>();
        for (String[] s : studentData) {
            User u = userRepository.save(new User(s[0], "student"));
            studentUsers.add(u);
            studentRepository.save(new Student(
                u.getId(), s[1], s[0], s[2],
                Double.parseDouble(s[3]),
                Integer.parseInt(s[4]),
                Integer.parseInt(s[5]),
                s[6]
            ));
        }

        // ======================================================================
        // JOB POSTINGS  (18 real top companies, multiple roles)
        // ======================================================================

        // --- Product / Tech Giants ---
        JobPosting google1 = jobPostingRepository.save(
                new JobPosting("Product Companies", "Google", "SDE Intern", 45, "Bengaluru", "CSE,IT,AI & DS"));
        JobPosting google2 = jobPostingRepository.save(
                new JobPosting("Product Companies", "Google", "ML Engineer Intern", 48, "Hyderabad", "CSE,AI & DS"));
        JobPosting microsoft1 = jobPostingRepository.save(
                new JobPosting("Product Companies", "Microsoft", "Software Engineer Intern", 42, "Hyderabad", "CSE,IT"));
        JobPosting microsoft2 = jobPostingRepository.save(
                new JobPosting("Product Companies", "Microsoft", "Data Scientist Intern", 40, "Bengaluru", "AI & DS,CSE"));
        JobPosting amazon1 = jobPostingRepository.save(
                new JobPosting("Product Companies", "Amazon", "SDE Intern", 38, "Bengaluru", "CSE,IT"));
        JobPosting amazon2 = jobPostingRepository.save(
                new JobPosting("Product Companies", "Amazon", "Cloud Support Engineer", 28, "Chennai", "CSE,IT,ECE"));
        JobPosting apple = jobPostingRepository.save(
                new JobPosting("Product Companies", "Apple", "Hardware Engineer Intern", 50, "Hyderabad", "ECE,EEE"));
        JobPosting meta = jobPostingRepository.save(
                new JobPosting("Product Companies", "Meta", "Frontend Engineer Intern", 55, "Remote", "CSE,IT"));
        JobPosting netflix = jobPostingRepository.save(
                new JobPosting("Product Companies", "Netflix", "Backend Engineer Intern", 52, "Remote", "CSE"));

        // --- Indian IT / Consulting ---
        JobPosting tcs = jobPostingRepository.save(
                new JobPosting("IT Services", "TCS", "Systems Engineer", 7, "Pan India", "CSE,IT,ECE,EEE,MECH"));
        JobPosting infosys = jobPostingRepository.save(
                new JobPosting("IT Services", "Infosys", "Systems Engineer", 6.5, "Pan India", "CSE,IT,ECE,EEE,MECH"));
        JobPosting wipro = jobPostingRepository.save(
                new JobPosting("IT Services", "Wipro", "Project Engineer", 6, "Pan India", "CSE,IT,ECE,EEE,MECH"));

        // --- FinTech ---
        JobPosting jpmorgan = jobPostingRepository.save(
                new JobPosting("FinTech Companies", "JPMorgan Chase", "Technology Analyst Intern", 25, "Mumbai", "CSE,IT,AI & DS"));
        JobPosting goldman = jobPostingRepository.save(
                new JobPosting("FinTech Companies", "Goldman Sachs", "Engineering Analyst Intern", 28, "Bengaluru", "CSE,IT"));
        JobPosting visa = jobPostingRepository.save(
                new JobPosting("FinTech Companies", "Visa", "Software Engineer Intern", 22, "Bengaluru", "CSE,IT"));

        // --- Consulting ---
        JobPosting deloitte = jobPostingRepository.save(
                new JobPosting("Consulting", "Deloitte", "Analyst Intern", 12, "Multiple Cities", "CSE,IT,AI & DS"));
        JobPosting accenture = jobPostingRepository.save(
                new JobPosting("Consulting", "Accenture", "Associate Software Engineer", 8, "Multiple Cities", "CSE,IT,ECE"));

        // --- Core / Manufacturing ---
        JobPosting bosch = jobPostingRepository.save(
                new JobPosting("Core Companies", "Bosch", "Embedded Software Engineer", 14, "Bengaluru", "ECE,EEE,CSE"));
        JobPosting siemens = jobPostingRepository.save(
                new JobPosting("Core Companies", "Siemens", "Graduate Trainee Engineer", 12, "Gurgaon", "EEE,ECE,MECH"));
        JobPosting lnt = jobPostingRepository.save(
                new JobPosting("Core Companies", "L&T Technology Services", "Design Engineer", 10, "Chennai", "MECH,ECE,EEE"));

        // --- Startups / Unicorns ---
        JobPosting razorpay = jobPostingRepository.save(
                new JobPosting("Startups", "Razorpay", "Backend Engineer Intern", 18, "Bengaluru", "CSE,IT"));
        JobPosting cred = jobPostingRepository.save(
                new JobPosting("Startups", "CRED", "Mobile Engineer Intern", 20, "Bengaluru", "CSE,IT"));
        JobPosting zerodha = jobPostingRepository.save(
                new JobPosting("Startups", "Zerodha", "Full Stack Developer Intern", 16, "Bengaluru", "CSE,IT,AI & DS"));

        // References for easy application mapping
        JobPosting[] allJobs = {
            google1, google2, microsoft1, microsoft2, amazon1, amazon2, apple, meta, netflix,
            tcs, infosys, wipro,
            jpmorgan, goldman, visa,
            deloitte, accenture,
            bosch, siemens, lnt,
            razorpay, cred, zerodha
        };

        // ======================================================================
        // JOB APPLICATIONS  (~250+ realistic applications)
        // ======================================================================
        String[] statuses = {"Applied", "Shortlisted", "Selected", "Rejected"};
        String[] dates = {
            "01 Jul 2026", "05 Jul 2026", "10 Jul 2026", "15 Jul 2026",
            "20 Jul 2026", "25 Jul 2026", "01 Aug 2026", "05 Aug 2026",
            "10 Aug 2026", "15 Aug 2026", "20 Aug 2026", "25 Aug 2026",
            "01 Sep 2026", "05 Sep 2026", "10 Sep 2026"
        };

        // Deterministic pseudo-random using student index + job index
        // Student 0 = Daksh, keep his original applications
        apply(studentUsers.get(0), google1, "02 Aug 2026", "Shortlisted");
        apply(studentUsers.get(0), jpmorgan, "05 Aug 2026", "Selected");
        apply(studentUsers.get(0), meta, "07 Aug 2026", "Applied");
        apply(studentUsers.get(0), razorpay, "10 Aug 2026", "Shortlisted");

        // Mass-student-applications: top students apply to dream companies,
        // mid-range apply to IT services + some product companies,
        // everyone eligible applies to TCS/Infosys/Wipro
        for (int si = 1; si < studentUsers.size(); si++) {
            User su = studentUsers.get(si);
            String[] sd = studentData[si];
            String branch = sd[2];
            double cgpa = Double.parseDouble(sd[3]);
            int backlogs = Integer.parseInt(sd[4]);

            int appCount = 0;

            // --- Tier 1: Google, Microsoft, Amazon, Meta, Netflix (CGPA >= 8.5, 0 backlogs) ---
            if (cgpa >= 8.5 && backlogs == 0) {
                if (google1.isOpenTo(branch)) {
                    apply(su, google1, dates[(si * 3) % dates.length], statuses[si % 4]);
                    appCount++;
                }
                if (google2.isOpenTo(branch) && si % 3 == 0) {
                    apply(su, google2, dates[(si * 5) % dates.length], statuses[(si + 1) % 4]);
                    appCount++;
                }
                if (microsoft1.isOpenTo(branch)) {
                    apply(su, microsoft1, dates[(si * 7) % dates.length], statuses[(si + 2) % 4]);
                    appCount++;
                }
                if (microsoft2.isOpenTo(branch) && si % 2 == 0) {
                    apply(su, microsoft2, dates[(si * 2) % dates.length], statuses[(si + 3) % 4]);
                    appCount++;
                }
                if (meta.isOpenTo(branch) && si % 3 != 0) {
                    apply(su, meta, dates[(si * 4) % dates.length], statuses[si % 4]);
                    appCount++;
                }
                if (netflix.isOpenTo(branch) && si % 5 == 0) {
                    apply(su, netflix, dates[(si * 6) % dates.length], statuses[(si + 1) % 4]);
                    appCount++;
                }
            }

            // --- Tier 2: Amazon, JPMorgan, Goldman, Visa, Razorpay, CRED (CGPA >= 7.5) ---
            if (cgpa >= 7.5 && backlogs <= 1) {
                if (amazon1.isOpenTo(branch) && si % 2 == 0) {
                    apply(su, amazon1, dates[(si * 3 + 1) % dates.length], statuses[(si + 1) % 4]);
                    appCount++;
                }
                if (amazon2.isOpenTo(branch) && si % 3 == 1) {
                    apply(su, amazon2, dates[(si * 4 + 2) % dates.length], statuses[(si + 2) % 4]);
                    appCount++;
                }
                if (jpmorgan.isOpenTo(branch) && si % 2 == 1) {
                    apply(su, jpmorgan, dates[(si * 5 + 1) % dates.length], statuses[(si + 3) % 4]);
                    appCount++;
                }
                if (goldman.isOpenTo(branch) && si % 4 == 0) {
                    apply(su, goldman, dates[(si * 2 + 3) % dates.length], statuses[si % 4]);
                    appCount++;
                }
                if (visa.isOpenTo(branch) && si % 3 == 2) {
                    apply(su, visa, dates[(si * 7 + 1) % dates.length], statuses[(si + 1) % 4]);
                    appCount++;
                }
                if (razorpay.isOpenTo(branch) && si % 4 == 1) {
                    apply(su, razorpay, dates[(si * 6 + 2) % dates.length], statuses[(si + 2) % 4]);
                    appCount++;
                }
                if (cred.isOpenTo(branch) && si % 5 == 2) {
                    apply(su, cred, dates[(si * 8 + 1) % dates.length], statuses[(si + 3) % 4]);
                    appCount++;
                }
                if (zerodha.isOpenTo(branch) && si % 4 == 3) {
                    apply(su, zerodha, dates[(si * 3 + 4) % dates.length], statuses[si % 4]);
                    appCount++;
                }
            }

            // --- Tier 3: Deloitte, Accenture (CGPA >= 7.0) ---
            if (cgpa >= 7.0) {
                if (deloitte.isOpenTo(branch) && si % 3 == 0) {
                    apply(su, deloitte, dates[(si * 4 + 3) % dates.length], statuses[(si + 1) % 4]);
                    appCount++;
                }
                if (accenture.isOpenTo(branch) && si % 2 == 1) {
                    apply(su, accenture, dates[(si * 5 + 4) % dates.length], statuses[(si + 2) % 4]);
                    appCount++;
                }
            }

            // --- Mass recruiters: TCS, Infosys, Wipro (open to almost everyone with CGPA >= 6.0) ---
            if (cgpa >= 6.0) {
                if (tcs.isOpenTo(branch)) {
                    apply(su, tcs, dates[(si * 2 + 5) % dates.length], statuses[(si + 3) % 4]);
                    appCount++;
                }
                if (infosys.isOpenTo(branch) && si % 2 == 0) {
                    apply(su, infosys, dates[(si * 3 + 6) % dates.length], statuses[si % 4]);
                    appCount++;
                }
                if (wipro.isOpenTo(branch) && si % 3 != 2) {
                    apply(su, wipro, dates[(si * 4 + 7) % dates.length], statuses[(si + 1) % 4]);
                    appCount++;
                }
            }

            // --- Core companies: Bosch, Siemens, L&T for ECE/EEE/MECH ---
            if (bosch.isOpenTo(branch) && cgpa >= 7.0 && si % 2 == 0) {
                apply(su, bosch, dates[(si * 6 + 3) % dates.length], statuses[(si + 2) % 4]);
                appCount++;
            }
            if (siemens.isOpenTo(branch) && cgpa >= 7.0 && si % 3 == 1) {
                apply(su, siemens, dates[(si * 7 + 4) % dates.length], statuses[(si + 3) % 4]);
                appCount++;
            }
            if (lnt.isOpenTo(branch) && cgpa >= 6.5 && si % 2 == 1) {
                apply(su, lnt, dates[(si * 5 + 5) % dates.length], statuses[si % 4]);
                appCount++;
            }

            // --- Apple for ECE/EEE ---
            if (apple.isOpenTo(branch) && cgpa >= 8.0 && backlogs == 0 && si % 3 == 0) {
                apply(su, apple, dates[(si * 8 + 2) % dates.length], statuses[(si + 1) % 4]);
                appCount++;
            }
        }

        // ======================================================================
        // ADMIN ACCOUNT  (sign-in never creates admins, so one is seeded here)
        // ======================================================================
        userRepository.save(new User("ADMIN01", "admin"));

        // ======================================================================
        // ADMIN TASKS
        // ======================================================================
        adminTaskRepository.save(new AdminTask("Company Approvals", 12));
        adminTaskRepository.save(new AdminTask("Job Postings Review", 8));
        adminTaskRepository.save(new AdminTask("Student Verifications", 23));
        adminTaskRepository.save(new AdminTask("Offer Letter Dispatches", 6));
        adminTaskRepository.save(new AdminTask("Interview Schedule Conflicts", 4));

        System.out.println("=== Data loaded: " + studentRepository.count() + " students, "
                + jobPostingRepository.count() + " job postings, "
                + jobApplicationRepository.count() + " applications ===");
    }

    /** Helper to save a job application along with its selection rounds. */
    private void apply(User user, JobPosting job, String appliedOn, String status) {
        JobApplication saved = jobApplicationRepository.save(new JobApplication(
                null, user.getId(), job.getId(), job.getCompany(), job.getRole(), appliedOn, status));
        placementService.createRounds(saved, job);
    }

    /** Query methods derived from method names, read back after loading. */
    private void demonstrateQueryMethods() {
        System.out.println("--- Query method demo ---");

        userRepository.findByAlias("RA2211026010123").ifPresent(daksh -> {
            var applications = jobApplicationRepository.findByUserId(daksh.getId());
            System.out.println("Applications found for " + daksh.getAlias() + ": " + applications.size());
            applications.forEach(application ->
                    System.out.println("Application ID: " + application.getId()
                            + ", Company: " + application.getCompany()
                            + ", Status: " + application.getStatus()));
        });

        System.out.println("FinTech postings: " + jobPostingRepository.findByCategory("FinTech Companies").size());
        System.out.println("Product postings: " + jobPostingRepository.findByCategory("Product Companies").size());
        System.out.println("IT Services postings: " + jobPostingRepository.findByCategory("IT Services").size());
    }
}
