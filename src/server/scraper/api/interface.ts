import type { ProgramStudyCourses, StudyApiTypes } from "../types";

export interface IStudyApi {
  getStudyPrograms: (config: StudyApiTypes.getStudyProgramsConfig) => Promise<StudyApiTypes.getStudyProgramsReturn>;
  getStudyCourseDetails: (
    config: StudyApiTypes.getStudyCourseDetailsConfig
  ) => Promise<StudyApiTypes.getStudyCourseDetailsReturn>;
  getStudyCoursesDetails: (
    config: StudyApiTypes.getStudyCoursesDetailsConfig
  ) => Promise<StudyApiTypes.getStudyCoursesDetailsReturn>;
  getTimeSchedule: (config: StudyApiTypes.getStudyTimeScheduleConfig) => Promise<StudyApiTypes.getStudyTimeScheduleReturn>;
  getStudyProgramCourses : (config: StudyApiTypes.getStudyProgramCoursesConfig) => Promise<ProgramStudyCourses>
}
