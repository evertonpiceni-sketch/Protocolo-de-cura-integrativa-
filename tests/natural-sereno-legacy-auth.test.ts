import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

test('the replaced Natural Sereno auth shell cannot restore the old Reintegração artwork or dark green card', () => {
  const profile = read('src/components/ProfileSetup.tsx');
  const theme = read('src/approved-theme.css');
  const naturalSerenoSheets = [
    'src/natural-sereno.css',
    'src/natural-sereno-refinement.css',
    'src/natural-sereno-approved-overrides.css'
  ].map(read);

  assert.ok(profile.includes('ep-auth-prestyle'));
  assert.doesNotMatch(profile, /ep-auth-style-one/);
  assert.doesNotMatch(theme, /#profile-setup-view\.ep-auth-style-one|#profile-setup-view \.ep-auth-nature-bg|#profile-setup-view::before|#profile-setup-view::after/);
  assert.ok(theme.includes('#profile-setup-view.ep-auth-prestyle'));
  for (const css of naturalSerenoSheets) {
    assert.doesNotMatch(css, /ep-auth-style-one/);
  }
  const homeAndMobile = [read('src/natural-sereno.css'), read('src/natural-sereno-mobile-fixes.css')].join('\\n');
  assert.doesNotMatch(homeAndMobile, /#063020|rgba\\(2,\\s*31,\\s*19/);
});
