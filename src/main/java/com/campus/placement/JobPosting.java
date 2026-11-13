package com.campus.placement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* A company's opening. branches is stored as one comma-separated column,
   e.g. "CSE,IT", and split back into a list by the React app. */
@Entity
@Table(name = "job_postings")
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String company;
    private String role;
    private double ctc;
    private String location;
    private String branches;

    protected JobPosting() {
    }

    public JobPosting(String category, String company, String role,
                      double ctc, String location, String branches) {
        this.category = category;
        this.company = company;
        this.role = role;
        this.ctc = ctc;
        this.location = location;
        this.branches = branches;
    }

    public Long getId() { return id; }
    public String getCategory() { return category; }
    public String getCompany() { return company; }
    public String getRole() { return role; }
    public double getCtc() { return ctc; }
    public String getLocation() { return location; }
    public String getBranches() { return branches; }

    public boolean isOpenTo(String branch) {
        for (String allowed : branches.split(",")) {
            if (allowed.trim().equals(branch)) {
                return true;
            }
        }
        return false;
    }
}
