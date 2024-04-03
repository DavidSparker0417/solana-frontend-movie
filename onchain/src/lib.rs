use solana_program::{
  account_info::{next_account_info, AccountInfo},
  borsh::try_from_slice_unchecked,
  entrypoint,
  entrypoint::ProgramResult,
  msg,
  program::invoke_signed,
  pubkey::Pubkey,
  system_instruction,
  sysvar::{rent::Rent, Sysvar},
};

use std::convert::TryInto;
pub mod instruction;
use instruction::MovieInstruction;
pub mod state;
use borsh::BorshSerialize;
use state::MovieAccountState;

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

  // Get Account iterator
  let account_info_iter = &mut accounts.iter();

  // Get accounts
  let initializer = next_account_info(account_info_iter)?;
  let pda_account = next_account_info(account_info_iter)?;
  let system_program = next_account_info(account_info_iter)?;

  // Derive PDA
  let (pda, bump_seed) = Pubkey::find_program_address(
      &[initializer.key.as_ref(), title.as_bytes().as_ref()],
      program_id,
  );
  let account_len: usize = 1 + 1 + (4 + title.len()) + (4 + description.len());

  // Calculate rent required
  let rent = Rent::get()?;
  let rent_lamports = rent.minimum_balance(account_len);

  // Create the account
  invoke_signed(
      &system_instruction::create_account(
          initializer.key,
          pda_account.key,
          rent_lamports,
          account_len.try_into().unwrap(),
          program_id,
      ),
      &[
          initializer.clone(),
          pda_account.clone(),
          system_program.clone(),
      ],
      &[&[
          initializer.key.as_ref(),
          title.as_bytes().as_ref(),
          &[bump_seed],
      ]],
  )?;

  msg!("PDA created: {}", pda);

  msg!("unpacking state account");
  let mut account_data =
      try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
  msg!("borrowed account data");

  account_data.title = title;
  account_data.rating = rating;
  account_data.description = description;
  account_data.is_initialized = true;

  msg!("serializing account");
  account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
  msg!("state account serialized");
  Ok(())
}
