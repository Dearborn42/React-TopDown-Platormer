import Leaderboard from '../models/Leaderboard.js';

export async function getLeaderboard(req, res) {
  try {
    const leaderboard = await Leaderboard.findById('65cd8b1fb471458aeb440eda');
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    return res.status(505).json({ success: false, error: error.message });
  }
}

export async function editLeaderboard(req, res) {
  try {
    const { score, name } = req.body;
    const leaderboard = await Leaderboard.findById('65cd8b1fb471458aeb440eda');
    var keys = ['first', 'second', 'third', 'fourth', 'fifth'];
    let newPosition = -1; // Indicates the position where the player should be inserted
    for (let i = 0; i < keys.length; i++) {
      const { playerScore } = leaderboard[keys[i]];
      if (score > playerScore) {
        newPosition = i;
        break;
      }
    }
    if (newPosition !== -1) {
      // Move lower-ranked players down
      for (let i = keys.length - 1; i > newPosition; i--) {
        leaderboard[keys[i]].playerName = leaderboard[keys[i - 1]].playerName;
        leaderboard[keys[i]].playerScore = leaderboard[keys[i - 1]].playerScore;
      }
      // Insert the new player at the newPosition
      leaderboard[keys[newPosition]].playerName = name;
      leaderboard[keys[newPosition]].playerScore = score;
    }

    // Remove players below top 5
    for (let i = keys.length - 1; i > 3; i--) {
      delete leaderboard[keys[i]];
    }
    await leaderboard.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(505).json({ success: false, error: error.message });
  }
}
