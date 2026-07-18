import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const contributors = [
  {
    name: 'Avishka Dinushan Jayakodi',
    role: 'Contributor',
    highlight: 'Built the secure authentication flow and the note editor experience.',
    contributions: [
      'Created the signup and login UI with form handling and validation.',
      'Implemented the backend auth flow for signup/login with password hashing and JWT generation.',
      'Developed the note editing and deletion experience, including update/delete API integration.',
      'Prepared beginner-friendly tutorials for authentication, editing, and delete actions.',
    ],
    linkedin: 'https://www.linkedin.com/in/avishka-dinushan-jayakodi1118',
  },
  {
    name: 'Kaveesha Kavindi Jagoda',
    role: 'Contributor',
    highlight: 'Built the main dashboard experience for creating and viewing notes.',
    contributions: [
      'Designed the protected dashboard layout and navigation flow.',
      'Built the create note form and note listing experience for logged-in users.',
      'Connected the project to the notes API for fetching and displaying user notes.',
      'Created simple tutorial guidance for beginners to understand dashboard and note creation.',
    ],
    linkedin: 'https://www.linkedin.com/in/kaveesha-jagoda-50a090380?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
];

function CreditsPage() {
  return (
    <div className="credit-page">
      <div className="credit-page__header">
        <div>
          <p className="dashboard__eyebrow">Project Credits</p>
          <h1 className="credit-page__title">Meet the team behind My Notes</h1>
          <p className="credit-page__subtitle">
            This project was developed as a two-member collaboration, with each contributor taking ownership of a clear part of the app and supporting the learning journey for beginners.
          </p>
        </div>
        <Link to="/login" className="credit-page__back-btn">
          Back to Login
        </Link>
      </div>

      <div className="credit-page__grid">
        {contributors.map((person) => (
          <article key={person.name} className="credit-card">
            <div className="credit-card__top">
              <p className="credit-card__role">{person.role}</p>
              <h2 className="credit-card__name">{person.name}</h2>
              <p className="credit-card__highlight">{person.highlight}</p>
            </div>

            <ul className="credit-card__list">
              {person.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <a className="credit-card__link" href={person.linkedin} target="_blank" rel="noreferrer">
              View LinkedIn Profile
            </a>
          </article>
        ))}
      </div>

      <section className="credit-page__note">
        <h3>Learning focus</h3>
        <p>
          Each member also prepared beginner-friendly tutorials so that other students can understand how the app was built step by step, from authentication and dashboard creation to note editing and deletion.
        </p>
      </section>
    </div>
  );
}

export default CreditsPage;
