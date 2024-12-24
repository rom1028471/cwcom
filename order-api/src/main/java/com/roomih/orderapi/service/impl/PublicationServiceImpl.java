package com.roomih.orderapi.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.roomih.orderapi.exception.ResourceNotFoundException;
import com.roomih.orderapi.model.Publication;
import com.roomih.orderapi.repository.PublicationRepository;
import com.roomih.orderapi.service.PublicationService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicationServiceImpl implements PublicationService {

    private final PublicationRepository publicationRepository;

    @Override
    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }

    @Override
    public Publication getPublicationById(Long id) {
        return publicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publication not found with id: " + id));
    }

    @Override
    @Transactional
    public Publication createPublication(Publication publication) {
        return publicationRepository.save(publication);
    }

    @Override
    @Transactional
    public Publication updatePublication(Long id, Publication publication) {
        Publication existingPublication = getPublicationById(id);
        
        existingPublication.setTitle(publication.getTitle());
        existingPublication.setDescription(publication.getDescription());
        existingPublication.setPricePerMonth(publication.getPricePerMonth());
        
        return publicationRepository.save(existingPublication);
    }

    @Override
    @Transactional
    public void deletePublication(Long id) {
        Publication publication = getPublicationById(id);
        publicationRepository.delete(publication);
    }

    @Override
    public Page<Publication> findPublications(String searchQuery, Pageable pageable) {
        if (searchQuery != null && !searchQuery.isEmpty()) {
            return publicationRepository.findByTitleContainingIgnoreCase(searchQuery, pageable);
        }
        return publicationRepository.findAll(pageable);
    }
} 