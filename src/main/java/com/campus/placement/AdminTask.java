package com.campus.placement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* One queue on the admin page, e.g. "Company Approvals" with 5 pending. */
@Entity
@Table(name = "admin_tasks")
public class AdminTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String task;
    private int pending;
    private String lastRemark;

    protected AdminTask() {
    }

    public AdminTask(String task, int pending) {
        this.task = task;
        this.pending = pending;
        this.lastRemark = "";
    }

    public Long getId() { return id; }
    public String getTask() { return task; }
    public int getPending() { return pending; }
    public String getLastRemark() { return lastRemark; }

    public void setPending(int pending) { this.pending = pending; }
    public void setLastRemark(String lastRemark) { this.lastRemark = lastRemark; }
}
