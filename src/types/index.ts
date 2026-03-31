export type JobStatus = "pending" | "rejected" | "accepted";

export type WorkType = "Remote" | "On-site" | "Hybrid";

export interface Job {
	id: string;
	user_id: string;
	company: string;
	position: string;
	work_type: WorkType;
	location: string;
	status: JobStatus;
	created_at: string;
}

export type JobInsert = Omit<Job, "id" | "user_id" | "created_at">;

export type JobFormInput = Omit<
	Job,
	"id" | "user_id" | "created_at" | "status"
>;

export interface Profile {
	id: string;
	name: string;
	goal: string;
	created_at: string;
}
