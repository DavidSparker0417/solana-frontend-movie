use solana_program::{
  account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

pub mod instruction;
use instruction::MovieInstruction;

entrypoint!(process_instruction);

pub fn process_instruction(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  instruction_data: &[u8],
) -> ProgramResult {
  // Unpack called
  let instruction = MovieInstruction::unpack(instruction_data)?;
  // Match against the data struct returned into `instruction` variable
  match instruction {
      MovieInstruction::AddMovieReview {
          title,
          rating,
          description,
      } => {
          // Make a call to `add_move_review` function
          add_movie_review(program_id, accounts, title, rating, description)
      }
  }
}

pub fn add_movie_review(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  title: String,
  rating: u8,
  description: String,
) -> ProgramResult {
  // Logging instruction data that was passed in
  msg!("Adding movie review...");
  msg!("Title: {}", title);
  msg!("Rating: {}", rating);
  msg!("Description: {}", description);

  Ok(())
}
