package com.campus.placement;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/* A signed-in account. The alias is the register number for a student or
   the company ID for a recruiter. */
@Entity
@Table(name = "app_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String alias;
    private String role;

    protected User() {
    }

    public User(String alias) {
        this.alias = alias;
    }

    public User(String alias, String role) {
        this.alias = alias;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getAlias() { return alias; }
    public String getRole() { return role; }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
