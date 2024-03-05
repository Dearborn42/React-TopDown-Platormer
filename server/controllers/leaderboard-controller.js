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
    for (let i = 0; i < keys.length; i++) {
      const { playerScore } = leaderboard[keys[i]];
      if (score > playerScore) {
        leaderboard[keys[i]].playerName = name;
        leaderboard[keys[i]].playerScore = score;
        await leaderboard.save();
        return res.status(200).json({ success: true, leaderboard });
      }
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(505).json({ success: false, error: error.message });
  }
}
