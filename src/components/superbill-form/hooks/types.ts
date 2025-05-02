
import { SetStateAction, Dispatch } from "react";

/**
 * Type for React state updater functions
 */
export type ReactStateUpdater<T> = Dispatch<SetStateAction<T>>;
