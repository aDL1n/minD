package dev.adlin.mind.message;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    List<MessageEntity> findByIdLessThanEqualOrderByIdAsc(Long id, Pageable pageable);

    List<MessageEntity> findByOrderByIdAsc(Pageable pageable);
}
