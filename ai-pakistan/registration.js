/* Set the confirmed adult-registration WhatsApp number in international digits.
 * Enable only after the receiving account and booking terms are ready.
 * No attendee data is saved or sent until the visitor sends the WhatsApp message.
 */
const registrationConfig = { whatsappNumber: '', bookingReady: false };

function buildRegistrationMessage(values) {
  return [
    'Hi, I would like to register for AI Launchpad with Rayyan Siddiqui.',
    'Date: October 18, 2026, 7–10 p.m. Pakistan time.',
    'Full fee: PKR 5,000.',
    `Adult registrant: ${values.registrant.trim()}`,
    `Student first name: ${values.student.trim()}`,
    `Student level: ${values.level}`,
    'I am an adult registering for myself or as a parent/guardian.',
    'I agree to receive registration and class updates on WhatsApp.',
    'Please send me the next steps to complete my registration.'
  ].join('\n');
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('registration-form');
  const button = document.getElementById('whatsapp-submit');
  const status = document.getElementById('registration-status');
  const validNumber = /^[1-9]\d{7,14}$/.test(registrationConfig.whatsappNumber);
  const beforeEvent = Date.now() < Date.parse('2026-10-18T19:00:00+05:00');
  const ready = registrationConfig.bookingReady && validNumber && beforeEvent;
  button.disabled = !ready;
  if (!beforeEvent) status.textContent = 'Registration for this masterclass has closed.';
  else if (ready) status.textContent = 'WhatsApp opens with your details filled in. Tap Send there to contact our team.';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!ready || !form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    if (!values.registrant.trim() || !values.student.trim()) {
      status.textContent = 'Please enter the adult registrant and student names.';
      return;
    }
    const message = buildRegistrationMessage(values);
    window.location.assign(`https://wa.me/${registrationConfig.whatsappNumber}?text=${encodeURIComponent(message)}`);
  });
}
if (typeof module !== 'undefined') module.exports = { buildRegistrationMessage, registrationConfig };
