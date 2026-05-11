using FcCompanion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FcCompanion.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Save> Saves => Set<Save>();
    public DbSet<Season> Seasons => Set<Season>();
    public DbSet<Club> Clubs => Set<Club>();
    public DbSet<Player> Players => Set<Player>();
    public DbSet<PlayerSeasonStats> PlayerSeasonStats => Set<PlayerSeasonStats>();
    public DbSet<PlayerOverallHistory> PlayerOverallHistories => Set<PlayerOverallHistory>();
    public DbSet<Transfer> Transfers => Set<Transfer>();
    public DbSet<Title> Titles => Set<Title>();
    public DbSet<Standing> Standings => Set<Standing>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Save>().ToTable("saves");
        modelBuilder.Entity<Season>().ToTable("seasons");
        modelBuilder.Entity<Club>().ToTable("clubs");
        modelBuilder.Entity<Player>().ToTable("players");
        modelBuilder.Entity<PlayerSeasonStats>().ToTable("player_season_stats");
        modelBuilder.Entity<PlayerOverallHistory>().ToTable("player_overall_history");
        modelBuilder.Entity<Transfer>().ToTable("transfers");
        modelBuilder.Entity<Title>().ToTable("titles");
        modelBuilder.Entity<Standing>().ToTable("standings");

        modelBuilder.Entity<Season>()
            .Property(s => s.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Club>().HasIndex(c => c.SaveId);
        modelBuilder.Entity<Player>().HasIndex(p => p.SaveId);
        modelBuilder.Entity<Player>().HasIndex(p => p.CurrentClubId);
        modelBuilder.Entity<PlayerSeasonStats>().HasIndex(p => p.PlayerId);
        modelBuilder.Entity<PlayerSeasonStats>().HasIndex(p => p.SeasonId);
        modelBuilder.Entity<Standing>().HasIndex(s => s.SeasonId);
        modelBuilder.Entity<Title>().HasIndex(t => t.ClubId);

        modelBuilder.Entity<Transfer>()
            .HasOne(t => t.FromClub).WithMany()
            .HasForeignKey(t => t.FromClubId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transfer>()
            .HasOne(t => t.ToClub).WithMany()
            .HasForeignKey(t => t.ToClubId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
