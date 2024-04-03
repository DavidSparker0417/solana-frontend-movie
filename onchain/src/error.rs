use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ReviewError {
    // Error 0
    #[error("Account not initialized yet")]
    UninitilizedAccount,
    // Error 1
    #[error("PDA derived does not equal PDA assed in")]
    InvalidPDA,
    // Error 2
    #[error("Iput data exceeds max length")]
    InvalidDataLength,
    // Error 3
    #[error("Rating greater than 5 or less than 1")]
    InvalidRating,
}
impl From<ReviewError> for ProgramError {
    fn from(e: ReviewError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
