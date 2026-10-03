package dev.adlin.mind.repository;

import dev.adlin.mind.entity.ChatMessageEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessageEntity, Long> {

    List<ChatMessageEntity> findByIdLessThanEqualOrderByIdDesc(long beforeId, Pageable pageable);

    List<ChatMessageEntity> findTopByOrderByTimestampDesc(Pageable pageable);
}
