package dev.adlin.mind.mapper;

import dev.adlin.mind.dto.ChatMessageDto;
import dev.adlin.mind.entity.ChatMessageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ChatMessageMapper {

    ChatMessageEntity toEntity(ChatMessageDto dto);
    ChatMessageDto toDomain(ChatMessageEntity entity);
}
