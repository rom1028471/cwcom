package com.roomih.orderapi.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.roomih.orderapi.model.Publication;

import java.util.List;

public interface PublicationService {
    List<Publication> getAllPublications();
    Publication getPublicationById(Long id);
    Publication createPublication(Publication publication);
    Publication updatePublication(Long id, Publication publication);
    void deletePublication(Long id);
    Page<Publication> findPublications(String searchQuery, Pageable pageable);
}
