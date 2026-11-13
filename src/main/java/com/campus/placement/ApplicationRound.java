package com.campus.placement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* One step of an application's selection process, e.g. "Online Assessment"
   or "HR Interview". applicationId is a scalar Long like the other links in
   this app. sequence orders the steps; status is one of Cleared, Scheduled,
   Upcoming, Rejected or Not Reached. date is blank until a step is scheduled. */
@Entity
@Table(name = "application_rounds")
public class ApplicationRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;
    private int sequence;
    private String name;
    private String status;
    private String date;

    protected ApplicationRound() {
    }

    public ApplicationRound(Long applicationId, int sequence, String name, String status, String date) {
        this.applicationId = applicationId;
        this.sequence = sequence;
        this.name = name;
        this.status = status;
        this.date = date;
    }

    public Long getId() { return id; }
    public Long getApplicationId() { return applicationId; }
    public int getSequence() { return sequence; }
    public String getName() { return name; }
    public String getStatus() { return status; }
    public String getDate() { return date; }
}
