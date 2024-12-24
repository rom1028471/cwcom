package com.roomih.orderapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.roomih.orderapi.model.Publication;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    Page<Publication> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    List<Publication> findByTitleContainingIgnoreCase(String title);
    boolean existsByTitle(String title);
}
