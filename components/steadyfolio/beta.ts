// ─────────────────────────────────────────────────────────────────────────────
// THE ONE THING TO EDIT WHEN THE BETA OPENS.
//
// Steadyfolio is on *internal* TestFlight (Yash is the only tester), so there is
// no public join link yet. While this is null the page shows a "Beta invites soon"
// status with an email link beneath it, rather than a button that goes nowhere.
//
// To open the beta: switch the group to public testing in App Store Connect and
// paste the https://testflight.apple.com/join/… URL here. Every call to action on
// the page picks it up.
// ─────────────────────────────────────────────────────────────────────────────
export const TESTFLIGHT_URL: string | null = null

export const BETA_EMAIL =
  'mailto:yash@yashkadam.com?subject=Steadyfolio%20beta%20invite'
