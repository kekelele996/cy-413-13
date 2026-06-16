ERROR_CODES = {
    "AUTH_INVALID_CREDENTIALS": "User[email] login failed: invalid credentials",
    "AUTH_TOKEN_INVALID": "User[token] auth failed: token invalid",
    "AUTH_ROLE_FORBIDDEN": "User[role] auth failed: role forbidden",
    "USER_EMAIL_EXISTS": "User[email] create failed: email already exists",
    "USER_NOT_FOUND": "User[id] lookup failed: user not found",
    "MOOD_NOT_FOUND": "Mood[id] lookup failed: mood not found",
    "MOOD_LEVEL_INVALID": "Mood[mood_level] validation failed: mood_level out of range",
    "MOOD_TAG_INVALID": "Mood[mood_tags] validation failed: MoodTag unsupported",
    "ASSESSMENT_NOT_FOUND": "Assessment[id] lookup failed: assessment not found",
    "ASSESSMENT_CATEGORY_INVALID": "Assessment[category] validation failed: AssessmentCategory unsupported",
    "JOURNAL_NOT_FOUND": "Journal[id] lookup failed: journal not found",
    "JOURNAL_PRIVATE_DENIED": "Journal[is_private] read failed: private journal denied",
    "GLOBAL_UNEXPECTED": "Global[request] failed: unexpected error",
}

