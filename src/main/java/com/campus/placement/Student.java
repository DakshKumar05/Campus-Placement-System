package com.campus.placement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* The profile recruiters see. userId is a plain Long, the same way the
   Attempt entity in the unit stores its user. */
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String registerNumber;
    private String branch;
    private double cgpa;
    private int backlogs;
    private int gradYear;
    private String skills;

    protected Student() {
    }

    public Student(Long userId, String name, String registerNumber, String branch,
                   double cgpa, int backlogs, int gradYear, String skills) {
        this.userId = userId;
        this.name = name;
        this.registerNumber = registerNumber;
        this.branch = branch;
        this.cgpa = cgpa;
        this.backlogs = backlogs;
        this.gradYear = gradYear;
        this.skills = skills;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getRegisterNumber() { return registerNumber; }
    public String getBranch() { return branch; }
    public double getCgpa() { return cgpa; }
    public int getBacklogs() { return backlogs; }
    public int getGradYear() { return gradYear; }
    public String getSkills() { return skills; }

    public void setName(String name) { this.name = name; }
    public void setBranch(String branch) { this.branch = branch; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }
    public void setBacklogs(int backlogs) { this.backlogs = backlogs; }
    public void setGradYear(int gradYear) { this.gradYear = gradYear; }
    public void setSkills(String skills) { this.skills = skills; }
}
