//
// SteppingAction.hh
// Tracks particle decays step-by-step
//

#ifndef SteppingAction_h
#define SteppingAction_h 1

#include "G4UserSteppingAction.hh"
#include "EventAction.hh"
#include "globals.hh"

class G4Step;

class SteppingAction : public G4UserSteppingAction
{
public:
  SteppingAction(EventAction* eventAction);
  ~SteppingAction() override;

  void UserSteppingAction(const G4Step*) override;

private:
  EventAction* fEventAction;
};

#endif
