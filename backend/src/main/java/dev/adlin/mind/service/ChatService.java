package dev.adlin.mind.service;

import dev.adlin.mind.dto.ChatMessageDto;
import dev.adlin.mind.mapper.ChatMessageMapper;
import dev.adlin.mind.repository.ChatRepository;
import dev.adlin.mind.entity.ChatMessageEntity;
import io.vavr.control.Try;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ChatService {

    private final ChatRepository repository;
    private final ChatMessageMapper mapper;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public @NonNull List<ChatMessageDto> getMessages(final @NonNull Pageable pageable) {
        return this.repository.findTopByOrderByTimestampDesc(pageable).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    public @NonNull List<ChatMessageDto> getPreviousMessages(final @NonNull Long beforeId, final @NonNull Pageable pageable) {
        return this.repository.findByIdLessThanEqualOrderByIdDesc(beforeId, pageable).reversed()
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    public @NonNull Optional<ChatMessageDto> receiveMessage(final @NonNull ChatMessageDto message) {
        final ChatMessageEntity entity = new ChatMessageEntity(
                null,
                message.message(),
                System.currentTimeMillis()
        );

        emitters.forEach(emitter ->
                Try.run(() -> emitter.send(entity))
                        .onFailure((_ -> {
                            emitter.complete();
                            emitters.remove(emitter);
                        }))
        );

        return Optional.of(mapper.toDomain(repository.save(entity)));
    }

    public @NonNull SseEmitter registerEmitter() {
        SseEmitter emitter = new SseEmitter(60000L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    public int getOnlineCount() {
        return emitters.size();
    }
}
