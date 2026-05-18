package com.tns.certificateservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tns.certificateservice.entity.Certificate;
import com.tns.certificateservice.repository.CertificateRepository;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository repository;

    // Get all certificates
    public List<Certificate> getAllCertificates() {
        return repository.findAll();
    }

    // Save certificate
    public Certificate saveCertificate(Certificate certificate) {
        return repository.save(certificate);
    }

    // Get certificate by ID
    public Certificate getCertificateById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // Delete certificate
    public void deleteCertificate(Long id) {
        repository.deleteById(id);
    }
}