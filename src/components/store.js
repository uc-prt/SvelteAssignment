import quizes from "./Quiz-store";

import { writable } from "svelte/store";

const questions = writable(quizes);

export default questions;