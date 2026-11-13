package com.campus.placement;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/* The REST API the React app calls. Every path starts with /api.
   The React app sends the signed-in user's id in the X-User-Id header.
   Admin routes need an admin caller; student routes only serve the
   caller's own records. Job postings and sign-in are open to everyone. */
@RestController
@RequestMapping("/api")
public class PlacementController {

    private static final String CALLER = "X-User-Id";

    private final PlacementService placementService;

    public PlacementController(PlacementService placementService) {
        this.placementService = placementService;
    }

    /** Any access check that fails anywhere below answers 403 with its reason. */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> denied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }

    @PostMapping("/login")
    public User login(@RequestBody User credentials) {
        return placementService.login(credentials.getAlias().trim(), credentials.getRole());
    }

    @GetMapping("/jobs")
    public List<JobPosting> getJobs() {
        return placementService.getJobs();
    }

    @GetMapping("/students/{userId}")
    public ResponseEntity<Student> getProfile(@RequestHeader(value = CALLER, required = false) Long callerId,
                                              @PathVariable Long userId) {
        placementService.requireSelf(callerId, userId);
        Student student = placementService.getProfile(userId);
        return student == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(student);
    }

    @PutMapping("/students/{userId}")
    public ResponseEntity<Student> updateProfile(@RequestHeader(value = CALLER, required = false) Long callerId,
                                                 @PathVariable Long userId, @RequestBody Student changes) {
        placementService.requireSelf(callerId, userId);
        Student student = placementService.updateProfile(userId, changes);
        return student == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(student);
    }

    @GetMapping("/applications/user/{userId}")
    public List<JobApplication> getApplications(@RequestHeader(value = CALLER, required = false) Long callerId,
                                                @PathVariable Long userId) {
        placementService.requireSelf(callerId, userId);
        return placementService.getApplications(userId);
    }

    @GetMapping("/applications/{id}/rounds")
    public ResponseEntity<List<ApplicationRound>> getRounds(@RequestHeader(value = CALLER, required = false) Long callerId,
                                                            @PathVariable Long id) {
        placementService.requireApplicationOwner(callerId, id);
        List<ApplicationRound> rounds = placementService.getRounds(id);
        return rounds == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(rounds);
    }

    @PostMapping("/applications/{userId}/{jobId}")
    public ResponseEntity<Object> apply(@RequestHeader(value = CALLER, required = false) Long callerId,
                                        @PathVariable Long userId, @PathVariable Long jobId) {
        placementService.requireSelf(callerId, userId);
        try {
            return ResponseEntity.ok(placementService.apply(userId, jobId));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/tasks")
    public List<AdminTask> getAdminTasks(@RequestHeader(value = CALLER, required = false) Long callerId) {
        placementService.requireRole(callerId, "admin");
        return placementService.getAdminTasks();
    }

    @PostMapping("/admin/tasks/{id}/resolve")
    public ResponseEntity<Object> resolveTask(@RequestHeader(value = CALLER, required = false) Long callerId,
                                              @PathVariable Long id,
                                              @RequestParam(defaultValue = "") String remark) {
        placementService.requireRole(callerId, "admin");
        try {
            return ResponseEntity.ok(placementService.resolveTask(id, remark));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
