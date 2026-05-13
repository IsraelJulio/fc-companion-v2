using AutoMapper;
using FcCompanion.Application.Interfaces;
using FcCompanion.Application.Mappings;
using FcCompanion.Application.UseCases.Clubs;
using FcCompanion.Application.UseCases.Dashboard;
using FcCompanion.Application.UseCases.Players;
using FcCompanion.Application.UseCases.Saves;
using FcCompanion.Application.UseCases.Seasons;
using FcCompanion.Application.UseCases.Seed;
using FcCompanion.Application.UseCases.Standings;
using FcCompanion.Application.UseCases.Leagues;
using FcCompanion.Application.UseCases.Titles;
using FcCompanion.Application.UseCases.Transfers;
using FcCompanion.Infrastructure.ExternalApis;
using FcCompanion.Infrastructure.Persistence;
using FcCompanion.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var mapperConfig = new MapperConfiguration(cfg => cfg.AddMaps(typeof(SaveMappingProfile).Assembly));
builder.Services.AddSingleton<IMapper>(mapperConfig.CreateMapper());

// Saves (F02)
builder.Services.AddScoped<ISaveRepository, SaveRepository>();
builder.Services.AddScoped<GetAllSavesUseCase>();
builder.Services.AddScoped<CreateSaveUseCase>();
builder.Services.AddScoped<DeleteSaveUseCase>();

// Seasons (F02/F09)
builder.Services.AddScoped<ISeasonRepository, SeasonRepository>();
builder.Services.AddScoped<IStandingRepository, StandingRepository>();
builder.Services.AddScoped<ITitleRepository, TitleRepository>();
builder.Services.AddScoped<GetSeasonsUseCase>();
builder.Services.AddScoped<GetCloseSeasonPreviewUseCase>();
builder.Services.AddScoped<CloseSeasonUseCase>();
builder.Services.AddScoped<GetStandingsUseCase>();
builder.Services.AddScoped<UpdateStandingUseCase>();
builder.Services.AddScoped<GetTopScorersByLeagueUseCase>();
builder.Services.AddScoped<GetTopAssistsByLeagueUseCase>();
builder.Services.AddScoped<GetChampionsHistoryUseCase>();
builder.Services.AddScoped<GetDashboardSummaryUseCase>();
builder.Services.AddScoped<GetDashboardTopScorersUseCase>();
builder.Services.AddScoped<GetDashboardTitleHistoryUseCase>();

// Players (F04)
builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
builder.Services.AddScoped<IPlayerSeasonStatsRepository, PlayerSeasonStatsRepository>();
builder.Services.AddScoped<IPlayerOverallHistoryRepository, PlayerOverallHistoryRepository>();
builder.Services.AddScoped<GetPlayersUseCase>();
builder.Services.AddScoped<GetPlayerByIdUseCase>();
builder.Services.AddScoped<GetPlayerOverallHistoryUseCase>();
builder.Services.AddScoped<CreatePlayerUseCase>();
builder.Services.AddScoped<UpdatePlayerUseCase>();
builder.Services.AddScoped<GetPlayerSeasonStatsUseCase>();
builder.Services.AddScoped<UpdatePlayerSeasonStatsUseCase>();

// Clubs (F05)
builder.Services.AddScoped<IClubRepository, ClubRepository>();
builder.Services.AddScoped<GetClubsUseCase>();
builder.Services.AddScoped<GetClubDetailUseCase>();
builder.Services.AddScoped<GetClubTitlesUseCase>();
builder.Services.AddScoped<CreateTitleUseCase>();
builder.Services.AddScoped<DeleteTitleUseCase>();

// Transfers (F06)
builder.Services.AddScoped<ITransferRepository, TransferRepository>();
builder.Services.AddScoped<GetTransfersUseCase>();
builder.Services.AddScoped<CreateTransferUseCase>();

// Seed (F03)
builder.Services.AddHttpClient<IFootballApiService, FootballApiClient>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["ApiFootball:BaseUrl"]!);
    client.DefaultRequestHeaders.Add("x-apisports-key", builder.Configuration["ApiFootball:Key"]!);
});
builder.Services.AddScoped<ISeedRepository, SeedRepository>();
builder.Services.AddScoped<SeedSaveUseCase>();

builder.Services.AddCors(options =>
    options.AddPolicy("Angular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()));

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    c.SwaggerDoc("v1", new() { Title = "FC Companion API", Version = "v1" }));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Angular");
app.UseAuthorization();
app.MapControllers();

app.MapGet("/api/v1/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow
}));

app.Run();
