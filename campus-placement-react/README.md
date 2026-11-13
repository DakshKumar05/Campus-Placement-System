# Campora – Campus Placement Management System

React (Vite) port of `campus-placement-system-dashboard_2.html`. Same visual
design, rebuilt as routed pages with state-driven rendering instead of direct
DOM manipulation.

Built to cover the Unit syllabus: the foundation of React, JSX, components,
events, forms, refs, styling, routing, the rules of hooks, the built-in hooks
(`useState`, `useEffect`, `useContext`, `useMemo`, `useRef`), writing custom
hooks and labelling them with `useDebugValue`.

## Running it

The data comes from the Spring Boot backend in the parent folder. Start it
first (run `CampusPlacementApplication` in IntelliJ, or `mvn spring-boot:run`
in `Campus-Placement-System`); it listens on port 8080 and the Vite dev
server proxies `/api` to it.

```bash
npm install
npm run dev      # development server with hot reload
npm run build    # production bundle into dist/
npm run preview  # serve the production bundle
```

## Structure

```
src/
  main.jsx                 createRoot + StrictMode + BrowserRouter
  App.jsx                  the route table
  styles/global.css        stylesheet ported from the HTML build
  components/              13 shared components (+ 2 CSS Modules)
  pages/                   9 page components, one per route
  hooks/                   8 custom hooks
  context/                 ToastProvider, PlacementProvider
  data/api.js              fetch helpers for the Spring Boot REST API
  data/seed.js             static lookups (branches, dashboard figures, nav links)
```

## Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | — | redirects to `/dashboard` |
| `/login` | LoginPage | controlled form, validation, focus ref |
| `/profile` | ProfilePage | view / edit form |
| `/jobs` | JobsPage | search box, eligibility dimming, apply |
| `/eligibility` | EligibilityPage | criteria form with a live preview |
| `/applications` | ApplicationsPage | list + CSV export |
| `/applications/:id` | ApplicationDetailPage | dynamic route, `useParams` |
| `/dashboard` | DashboardPage | animated stats, Ctrl+E export |
| `/admin` | AdminPage | approve / reject with a remark |
| `*` | NotFoundPage | catch-all 404 |

## Hooks used

**Built-in:** `useState` (15), `useEffect` (8), `useMemo` (6), `useRef` (6),
`useContext` (2), plus `useDebugValue` (5) for labelling custom hooks.

**Custom:** `useForm`, `usePlacement`, `useToast`, `useToastContext`,
`useLocalStorage`, `useEligibleJobs`, `useCountUp`,
`useIntersectionObserver`, `useCsvExport`, `useDocumentTitle`.

**Router:** `useNavigate`, `useParams`, plus `NavLink`, `Link`, `Outlet`.

See `React_Components_and_Hooks_Report.pdf` in the parent folder for the full
catalogue.
