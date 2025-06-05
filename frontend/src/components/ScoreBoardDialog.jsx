import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';

const ScorecardModal = ({
  open,
  scorecard,
  isHost,
  onNextQuestion,
  correctAnswer,
}) => {
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Scorecard</DialogTitle>
      <DialogContent dividers>
        <List>
          {Object.entries(scorecard).map(
            ([playerId, { username, score, answer }]) => (
              <React.Fragment key={playerId}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6">{username}</Typography>
                    }
                    secondary={
                      <>
                        <Typography>
                          <strong>Score:</strong> {score}
                        </Typography>
                        <Typography>
                          <strong>Selected Answer:</strong>{' '}
                          <span
                            style={{
                              color:
                                answer === correctAnswer ? 'green' : 'red',
                            }}
                          >
                            {answer || 'No Answer'}
                          </span>
                        </Typography>
                        <Typography>
                          <strong>Correct Answer:</strong>{' '}
                          <span style={{ color: 'green' }}>{correctAnswer}</span>
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            )
          )}
        </List>
      </DialogContent>
      {isHost && (
        <DialogActions>
          <Button variant="contained" color="primary" onClick={onNextQuestion}>
            Next Question
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ScorecardModal;
