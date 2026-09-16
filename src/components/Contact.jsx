import { useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { company } from '../data/company';
import { Reveal } from './Reveal';
import Icon from './Icon';
import Corners from './Corners';
import MagneticButton from './MagneticButton';

const PROJECT_TYPES = [
  'Scan to BIM',
  'Scan to CAD',
  'PDF to BIM',
  'CAD to BIM',
  'Revit Modeling',
  '3D BIM Modeling',
  'As-Built Modeling',
  'Other / Multiple',
];

const INITIAL = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  else if (values.name.trim().length < 2) errors.name = 'Name looks too short.';

  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.';

  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim()))
    errors.phone = 'Please enter a valid phone number.';

  if (!values.projectType) errors.projectType = 'Select a project type.';

  if (!values.message.trim()) errors.message = 'Tell us a little about your project.';
  else if (values.message.trim().length < 12)
    errors.message = 'Please add a bit more detail (min. 12 characters).';

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const reduced = useReducedMotion();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((v) => ({ ...v, [name]: value }));
      // live-clear errors for touched fields
      if (touched[name]) {
        setErrors((prev) => {
          const next = validate({ ...values, [name]: value });
          return { ...prev, [name]: next[name] || undefined };
        });
      }
    },
    [touched, values],
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((t) => ({ ...t, [name]: true }));
      const next = validate(values);
      setErrors((prev) => ({ ...prev, [name]: next[name] }));
    },
    [values],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const all = validate(values);
      setErrors(all);
      setTouched(Object.keys(values).reduce((a, k) => ({ ...a, [k]: true }), {}));
      if (Object.keys(all).length) {
        // focus the first invalid field
        const first = Object.keys(all)[0];
        document.getElementById(`field-${first}`)?.focus();
        return;
      }
      setStatus('submitting');
      // No backend in this demo — simulate a successful submission.
      await new Promise((r) => setTimeout(r, 1100));
      setStatus('success');
    },
    [values],
  );

  const reset = () => {
    setValues(INITIAL);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const contactItems = [
    {
      icon: 'mail',
      label: 'Email',
      value: company.email.value,
      href: `mailto:${company.email.value}`,
      placeholder: company.email.placeholder,
    },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/company/visual-bim',
      href: company.linkedin.value,
      placeholder: company.linkedin.placeholder,
    },
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-line/8 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="blueprint absolute inset-0 opacity-20" />
        <div className="absolute left-1/2 top-0 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-gold/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left — intro + contact info */}
          <div className="lg:col-span-5">
            <span className="label text-gold">06 / Contact</span>
            <h2 className="mt-5 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.08] tracking-tight">
              Let's Build Your{' '}
              <span className="text-gradient glow-text">Digital Model</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-concrete-light">
              Have a project that needs accurate BIM documentation, 3D modeling,
              or digital construction support? Get in touch with Visual BIM.
            </p>

            <div className="mt-10 space-y-3">
              {contactItems.map((item) => (
                <Reveal key={item.label} delay={0.08}>
                  <a
                    href={item.href}
                    target={item.label === 'LinkedIn' ? '_blank' : undefined}
                    rel={item.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                    className="panel panel-hover group flex items-center gap-4 p-4"
                  >
                    <span className="flex h-11 w-11 flex-none items-center justify-center border border-sky/25 text-gold transition-all duration-300 group-hover:border-sky/60 group-hover:bg-gold/10">
                      <Icon name={item.icon} size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="label text-[0.55rem] text-concrete/75">{item.label}</p>
                      <p className="mt-1 truncate text-sm font-medium text-warm transition-colors group-hover:text-gold">
                        {item.value}
                      </p>
                    </div>
                    {item.placeholder && (
                      <span className="label shrink-0 border border-gold/30 bg-gold/10 px-2 py-1 text-[0.5rem] text-gold-light/90">
                        PLACEHOLDER
                      </span>
                    )}
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-6 flex items-start gap-3 border border-line/10 bg-blueprint-900/50 p-4">
                <Icon name="shield" size={16} className="mt-0.5 flex-none text-gold/80" />
                <p className="text-xs leading-relaxed text-concrete/80">
                  Contact details shown above are clearly marked placeholders.
                  They will be replaced with the official Visual BIM email and
                  LinkedIn URL as soon as they are provided.
                </p>
              </div>
            </Reveal>
          </div>

          {/* right — form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="panel relative flex min-h-[28rem] flex-col items-center justify-center p-10 text-center"
                >
                  <Corners />
                  <span className="flex h-16 w-16 items-center justify-center border border-sky/40 text-gold glow-box">
                    <Icon name="check" size={30} strokeWidth={2} />
                  </span>
                  <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                    Inquiry Sent
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-concrete-light">
                    Thank you — your project brief has been received. The Visual
                    BIM team will respond within one business day.
                  </p>
                  <div className="mt-8">
                    <MagneticButton variant="outline" onClick={reset}>
                      Send Another Inquiry
                    </MagneticButton>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="panel relative p-6 sm:p-8"
                >
                  <Corners />

                  <div className="mb-6 flex items-center justify-between">
                    <span className="label text-concrete-light">Project Brief</span>
                    <span className="label text-concrete/60">
                      {Object.keys(errors).filter((k) => errors[k]).length} FIELD(S) TO REVIEW
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field
                      id="field-name"
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name}
                      autoComplete="name"
                      placeholder="Your full name"
                    />
                    <Field
                      id="field-company"
                      label="Company"
                      name="company"
                      value={values.company}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="organization"
                      placeholder="Company / organisation"
                      optional
                    />
                    <Field
                      id="field-email"
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email}
                      autoComplete="email"
                      placeholder="you@company.com"
                    />
                    <Field
                      id="field-phone"
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && errors.phone}
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      optional
                    />
                    <div className="sm:col-span-2">
                      <SelectField
                        id="field-projectType"
                        label="Project Type"
                        name="projectType"
                        value={values.projectType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.projectType && errors.projectType}
                        options={PROJECT_TYPES}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TextArea
                        id="field-message"
                        label="Message"
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.message && errors.message}
                        placeholder="Describe the building, the source data (scans / CAD / PDFs), the required LOD, and your timeline…"
                      />
                    </div>
                  </div>

                  <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-concrete/75">
                      Your details stay private — no spam, ever.
                    </p>
                    <MagneticButton
                      type="submit"
                      variant="primary"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto"
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputBase =
  'w-full bg-black-950/70 border px-4 py-3 text-sm text-warm placeholder:text-concrete/55 outline-none transition-all duration-300 focus:border-sky focus:bg-black-950/80';

function Field({ label, error, optional, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label flex items-center gap-2 text-concrete-light">
        {label}
        {optional && <span className="text-concrete/60">(optional)</span>}
      </span>
      <input
        className={`${inputBase} ${error ? 'border-red-400/60' : 'border-line/12'}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      <FieldError error={error} />
    </label>
  );
}

function TextArea({ label, error, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label text-concrete-light">{label}</span>
      <textarea
        rows={5}
        className={`${inputBase} resize-none ${error ? 'border-red-400/60' : 'border-line/12'}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      <FieldError error={error} />
    </label>
  );
}

function SelectField({ label, error, options, ...props }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label text-concrete-light">{label}</span>
      <div className="relative">
        <select
          className={`${inputBase} appearance-none pr-10 ${
            error ? 'border-red-400/60' : 'border-line/12'
          } ${props.value ? 'text-warm' : 'text-concrete/55'}`}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <option value="" className="bg-black-900 text-concrete-light">
            Select a service…
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-black-900 text-warm">
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-concrete-light/50">
          <Icon name="arrow-down" size={14} />
        </span>
      </div>
      <FieldError error={error} />
    </label>
  );
}

function FieldError({ error }) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 overflow-hidden text-xs text-red-400"
          role="alert"
        >
          <Icon name="x" size={11} strokeWidth={2.4} className="flex-none" />
          {error}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
