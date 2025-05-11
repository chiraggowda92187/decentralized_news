use anchor_lang::prelude::*;
declare_id!("5ovZoJEY3eFKhFGZ7ZaT5jVKftyyfQGBUQ7m6DX11agc");

#[program]
pub mod decentralized_news {
    use super::*;

    pub fn initialize_news(ctx: Context<InitializeNews>, content: String, timestamp: i64) -> Result<()> {
        require!(content.len() <= 1000, CustomError::ContentTooLong);

        let news = &mut ctx.accounts.news;
        news.content = content;
        news.upvotes = 0;
        news.downvotes = 0;
        news.timestamp = timestamp;
        news.creator = *ctx.accounts.authority.key;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, upvote: bool) -> Result<()> {
        let news = &mut ctx.accounts.news;

        if upvote {
            news.upvotes += 1;
        } else {
            news.downvotes += 1;
        }

        Ok(())
    }

    pub fn reward(ctx: Context<RewardContext>) -> Result<()> {
        let news = &ctx.accounts.news;
        let reward_account = &mut ctx.accounts.reward;
    
        let now = Clock::get()?.unix_timestamp;
        require!(now > news.timestamp + 180, CustomError::VotingPeriodNotEnded);
    
        if news.upvotes >= news.downvotes {
            reward_account.amount = news.upvotes * 1080000;
        } else {
            reward_account.amount = news.downvotes * 1080000;
        }
    
        // Correctly structure the seeds for invoke_signed
        let seeds: &[&[u8]] = &[
            b"vault", 
            &ctx.bumps.vault.to_le_bytes()  // Convert bump to bytes
        ];
    
        // Perform the transfer
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.vault.key,
            ctx.accounts.news_creator.key,
            reward_account.amount,
        );
    
        anchor_lang::solana_program::program::invoke_signed(
            &ix,
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.news_creator.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[seeds], // Pass the correct seed format
        )?;
    
        Ok(())
    }
    
    
}

#[derive(Accounts)]
#[instruction(content: String, timestamp: i64)]
pub struct InitializeNews<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + News::MAX_SIZE,
        seeds = [b"news", authority.key().as_ref(), &timestamp.to_le_bytes()],
        bump
    )]
    pub news: Account<'info, News>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub news: Account<'info, News>,
}

#[derive(Accounts)]
pub struct RewardContext<'info> {
    #[account(
        init_if_needed,
        payer = news_creator,
        space = 8 + RewardData::MAX_SIZE,
        seeds = [b"reward", news.key().as_ref()],
        bump
    )]
    pub reward: Account<'info, RewardData>,
    #[account(mut)]
    pub news: Account<'info, News>,
    #[account(mut, address = news.creator)]
    pub news_creator: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct News {
    pub content: String,
    pub upvotes: u64,
    pub downvotes: u64,
    pub timestamp: i64,
    pub creator: Pubkey,
}

impl News {
    pub const MAX_SIZE: usize = 4 + 1000 + 8 + 8 + 8 + 32; // content (up to 256 chars) + counts + timestamp + pubkey
}

#[account]
pub struct RewardData {
    pub amount: u64,
}

impl RewardData {
    pub const MAX_SIZE: usize = 8;
}

#[error_code]
pub enum CustomError {
    #[msg("Voting period has not ended yet")]
    VotingPeriodNotEnded,

    #[msg("Content too long")]
    ContentTooLong,
}
