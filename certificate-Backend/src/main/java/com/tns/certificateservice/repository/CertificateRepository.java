package com.tns.certificateservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tns.certificateservice.entity.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

}