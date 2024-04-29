package com.cg.farmirang.backenduser.feature.security.dto.response;

import com.cg.farmirang.backenduser.feature.user.entity.MemberRole;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;

public record JwtValidateTokenResponseDto(
	@NotBlank
	@Schema(description = "사용자 ID", example = "1")
	@JsonProperty("member_id")
	Integer memberId,
	@NotBlank
	@Schema(description = "사용자 닉네임", example = "파미랑")
	String nickname,
	@NotBlank
	@Schema(description = "사용자 프로필 이미지", example = "http://localhost/profile.jpg")
	@JsonProperty("profile_img")
	String profileImg,
	@NotBlank
	@Schema(description = "사용자 권한", example = "member")
	@Enumerated(EnumType.STRING)
	MemberRole role,
	@NotBlank
	@Schema(description = "기기 구분 번호", example = "1234")
	@JsonProperty("device_id")
	String deviceId
) {
}
