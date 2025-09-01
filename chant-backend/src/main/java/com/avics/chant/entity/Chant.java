package com.avics.chant.entity;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chants")
public class Chant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userIdentifier; // username or phoneNo

    @Column(nullable = false)
    private LocalDate chantDate;

    @Column(nullable = false)
    private Integer chantCount;

}
