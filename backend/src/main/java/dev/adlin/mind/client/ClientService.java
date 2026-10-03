package dev.adlin.mind.client;

import dev.adlin.mind.message.MessageDto;
import io.vavr.control.Try;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.HashSet;
import java.util.Set;

@Service
public class ClientService {

    private final Set<SseEmitter> clients = new HashSet<>();

    public @NonNull SseEmitter subscribe() {
        final SseEmitter client = new SseEmitter(60000L);

        client.onCompletion(() -> clients.remove(client));
        client.onTimeout(() -> clients.remove(client));

        clients.add(client);

        return client;
    }

    public int getOnlineCount() {
        return clients.size();
    }

    public void broadcast(final @NonNull MessageDto message) {
        clients.forEach(emitter -> tryReceive(emitter, message));
    }

    private void tryReceive(final @NonNull SseEmitter client, final @NonNull MessageDto message) {
        Try.run(() -> client.send(message))
                .onFailure(_ -> {
                    clients.remove(client);
                    client.complete();
                });
    }
}
