package dev.adlin.mind.client;

import dev.adlin.mind.message.MessageDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClientServiceTest {
    static Stream<Exception> disconnectedClients() {
        return Stream.of(new IOException("Broken pipe"), new IllegalStateException("AsyncContext is already closed"));
    }

    @ParameterizedTest
    @MethodSource("disconnectedClients")
    void failedClientDoesNotInterruptBroadcastOrGetCompletedAgain(Exception failure) throws Exception {
        try (var construction = mockConstruction(SseEmitter.class)) {
            var service = new ClientService();
            var disconnected = service.subscribe();
            var connected = service.subscribe();
            var message = new MessageDto(1L, "hello", 100L);
            doThrow(failure).when(disconnected).send(message);
            // Reproduces Tomcat rejecting completion after a container error.
            doThrow(new IllegalStateException("AsyncContext cannot be used after onError"))
                    .when(disconnected).complete();

            assertEquals(2, construction.constructed().size());
            assertDoesNotThrow(() -> service.broadcast(message));
            assertEquals(1, service.getOnlineCount());
            assertDoesNotThrow(() -> service.broadcast(message));
            verify(connected, times(2)).send(message);
            verify(disconnected).send(message);
            verify(disconnected, never()).complete();
            verify(disconnected, never()).completeWithError(any());
        }
    }

    @Test
    void lifecycleCallbacksRemoveClientsIdempotently() {
        try (var construction = mockConstruction(SseEmitter.class)) {
            var service = new ClientService();
            var completed = service.subscribe();
            var timedOut = service.subscribe();
            var errored = service.subscribe();
            var completion = ArgumentCaptor.forClass(Runnable.class);
            var timeout = ArgumentCaptor.forClass(Runnable.class);
            @SuppressWarnings("unchecked")
            ArgumentCaptor<Consumer<Throwable>> error = ArgumentCaptor.forClass(Consumer.class);
            verify(completed).onCompletion(completion.capture());
            verify(timedOut).onTimeout(timeout.capture());
            verify(errored).onError(error.capture());
            assertEquals(3, construction.constructed().size());

            completion.getValue().run();
            completion.getValue().run();
            assertEquals(2, service.getOnlineCount());
            timeout.getValue().run();
            assertEquals(1, service.getOnlineCount());
            error.getValue().accept(new IOException("Connection reset"));
            assertEquals(0, service.getOnlineCount());
        }
    }
}
