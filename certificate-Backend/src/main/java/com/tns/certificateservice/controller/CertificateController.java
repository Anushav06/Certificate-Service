package com.tns.certificateservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.tns.certificateservice.entity.Certificate;
import com.tns.certificateservice.service.CertificateService;

@RestController
@RequestMapping("/certificates")
@CrossOrigin("*")
public class CertificateController {

    @Autowired
    private CertificateService service;

    // GET all certificates
    @GetMapping
    public List<Certificate> getAllCertificates() {
        return service.getAllCertificates();
    }

    // POST new certificate
    @PostMapping
    public Certificate addCertificate(@RequestBody Certificate certificate) {
        return service.saveCertificate(certificate);
    }

    // GET certificate by ID
    @GetMapping("/{id}")
    public Certificate getCertificateById(@PathVariable Long id) {
        return service.getCertificateById(id);
    }

    // DELETE certificate
    @DeleteMapping("/{id}")
    public void deleteCertificate(@PathVariable Long id) {
        service.deleteCertificate(id);
    }
    
    @PutMapping("/{id}")
    public Certificate updateCertificate(@PathVariable Long id,
                                         @RequestBody Certificate certificate) {

        Certificate existingCertificate = service.getCertificateById(id);

        existingCertificate.setCertificateName(certificate.getCertificateName());
        existingCertificate.setIssuedTo(certificate.getIssuedTo());
        existingCertificate.setIssueDate(certificate.getIssueDate());
        existingCertificate.setExpiryDate(certificate.getExpiryDate());
        existingCertificate.setAuthority(certificate.getAuthority());

        return service.saveCertificate(existingCertificate);
    }
}