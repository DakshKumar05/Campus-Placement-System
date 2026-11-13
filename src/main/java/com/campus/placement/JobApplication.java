package com.campus.placement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* A student's application to a posting - this app's version of the unit's
   Attempt entity. userId and jobId are scalar Longs, not JPA relationships.
   company and role are copied from the posting so the list can be shown
   without a second lookup. */
@Entity
@Table(name = "job_applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long jobId;
    private String company;
    private String role;
    private String appliedOn;
    private String status;

    protected JobApplication() {
    }

    public JobApplication(Long id, Long userId, Long jobId, String company,
                          String role, String appliedOn, String status) {
        this.id = id;
        this.userId = userId;
        this.jobId = jobId;
        this.company = company;
        this.role = role;
        this.appliedOn = appliedOn;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getJobId() { return jobId; }
    public String getCompany() { return company; }
    public String getRole() { return role; }
    public String getAppliedOn() { return appliedOn; }
    public String getStatus() { return status; }

    public void setStatus(String status) {
        this.status = status;
    }
}
