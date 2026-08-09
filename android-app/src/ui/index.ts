/**
 * JobEzz UI Library — public barrel.
 * Import shared surfaces from here: atoms, molecules, feedback, overlays.
 */

/* Atoms */
export { Button } from './atoms/Button';
export type { ButtonVariant, ButtonSize, ButtonProps } from './atoms/Button';
export { Card } from './atoms/Card';
export type { CardProps } from './atoms/Card';
export { Chip } from './atoms/Chip';
export type { ChipProps } from './atoms/Chip';
export { Badge, Tag } from './atoms/Badge';
export type { BadgeProps, TagProps, BadgeVariant } from './atoms/Badge';
export { Avatar, BrandLetterAvatar, Verified } from './atoms/Avatar';
export { Stars, RateStars } from './atoms/Stars';
export { IconTile, RowEdge } from './atoms/IconTile';
export { TrustBadge } from './atoms/TrustBadge';
export { Input, SearchBar } from './atoms/Input';
export type { InputProps } from './atoms/Input';
export { Toggle } from './atoms/Toggle';

/* Molecules */
export { Header, HeaderBack, Shell } from './molecules/Header';
export { SectionTitle } from './molecules/SectionTitle';
export { EmptyState, ErrorState } from './molecules/EmptyState';
export { ListItem } from './molecules/ListItem';
export { BottomTabBar, useTabBarClearance } from './molecules/BottomTabBar';
export type { TabItemDef } from './molecules/BottomTabBar';
export { ProgressBar, ProgressLine, StepIndicator } from './molecules/Progress';
export { JobCard } from './molecules/JobCard';
export type { JobLike } from './molecules/JobCard';
export { ProviderRow } from './molecules/ProviderRow';
export type { ProviderLike } from './molecules/ProviderRow';
export { MatchScore, Kpi, KpiRow } from './molecules/Stat';
export { MapBox } from './molecules/MapBox';
export { SearchField } from './molecules/SearchField';
export { StatRow } from './molecules/StatRow';

/* Feedback */
export { SkeletonCard, SkeletonRow, SkeletonList } from './feedback/Skeleton';
export { ToastProvider, useToast } from './feedback/Toast';
export type { ToastVariant } from './feedback/Toast';

/* Overlays */
export { BottomSheet, Dialog } from './overlays/Overlays';

/* Glass panel lives with depth */
export { DepthScreen, DepthGradient, AmbientGlow } from '../design/depth';
export { PulseDot } from '../design/motion';
