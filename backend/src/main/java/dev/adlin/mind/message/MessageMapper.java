package dev.adlin.mind.message;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface MessageMapper {

    MessageEntity toEntity(MessageDto dto);
    MessageDto toDto(MessageEntity entity);
}
