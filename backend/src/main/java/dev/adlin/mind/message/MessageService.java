package dev.adlin.mind.message;

import dev.adlin.mind.client.ClientService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository repository;
    private final MessageMapper mapper;

    private final ClientService clientService;

    public @NonNull List<MessageDto> get(final @NonNull Pageable pageable) {
        return this.repository.findTopByOrderByTimestampDesc(pageable).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public @NonNull List<MessageDto> getPrevious(
            final @NonNull Long beforeId,
            final @NonNull Pageable pageable
    ) {
        return this.repository.findByIdLessThanEqualOrderByIdDesc(beforeId, pageable)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public void receive(final @NonNull MessageDto message) {
        final MessageEntity entity = new MessageEntity(
                null,
                message.payload(),
                System.currentTimeMillis()
        );

        final MessageEntity saved = repository.save(entity);
        clientService.broadcast(mapper.toDto(saved));
    }
}
