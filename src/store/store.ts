import type { VALIDITY } from "~/components/homepage/utils";
import type { CustomEvent } from "~/components/scheduler/event/types";
import { LECTURE_TYPE } from "~/enums/enums";
import type { LectureMutator } from "~/server/scraper/lectureMutator";
import type { DataProviderTypes } from "~/server/scraper/types/data.types";
import { CoursesTimespan } from "~/store/coursesTimespan";
import { createNewCourse } from "~/store/courseStore";
import { DataStore } from "~/store/dataStore";
import type { Course, Data, ISchedulerSettings } from "~/store/store.types";
import type { StoreJson } from "~/store/storeSchema";

const defaultSettings: ISchedulerSettings = {
  columns: [],
  rows: {},
};

export class SchedulerStore implements StoreJson {
  private static readonly defaultSettings: ISchedulerSettings = defaultSettings;
  public readonly settings: ISchedulerSettings;
  public courses: Course[];
  public customEvents: CustomEvent[];
  constructor(
    settings: ISchedulerSettings,
    private readonly eventFilter?: (event: LectureMutator.MutatedLecture) => boolean
  ) {
    this.settings = { ...SchedulerStore.defaultSettings, ...settings };
    this.courses = [];
    this.customEvents = [];
  }

  // ---- Courses ----

  public getCourse = (courseId: string) => this.courses.find((course) => course.detail.id === courseId);

  // must be a setter to trigger reactivity
  public set newCourses(courses: DataProviderTypes.getStudyCoursesDetailsReturn) {
    this.courses = courses.map((course) => {
      const existingCourse = this.getCourse(course.detail.id);
      if (!existingCourse) return createNewCourse(course);
      if (existingCourse.detail.url !== course.detail.url) {
        existingCourse.detail = course.detail;
      }
      return existingCourse;
    });
  }

  // ---- Custom Events ----

  // ---- Data ----

  private get dataStore(): DataStore {
    return new DataStore(this).withCustomEvents(this.customEvents).fromCourses(this.courses);
  }

  public get data(): Data {
    return this.dataStore.sort().data;
  }

  public get checkedData(): Data {
    return this.dataStore.clone((eventStore) => eventStore.event.checked).sort().data;
  }

  // previousely called selected
  public get coursesTimeSpan(): Record<string, { validity: VALIDITY; courseData: Record<LECTURE_TYPE, number> }> {
    return new CoursesTimespan(this.courses).getCoursesTimeSpan();
  }

  // ---- Events ----
  public getLinkedEvent = (linkedData: LectureMutator.LinkedLectureData, courseId: string) => {
    const course = this.courses.find((course) => course.detail.id === courseId);
    if (!course) return undefined;
    return course.data.find((event) => event.id === linkedData.id);
  };
}

/**
 * CURRENT STATE
 *
 * properties (persisted) set in constructor
 * courses
 * customEvents
 * settings
 *
 * +get >
 * data
 * checkedData
 * selected
 * courses
 * customEvents
 * settings?
 *
 *
 * +set <
 * newCourses
 *
 * +methods
 * clearCourses
 * addCustomEvent
 * getEventData
 */

/**
 * NEW STATE
 * +get >
 * emptyData
 * (
 * data
 * checkedData
 * )
 * selectedTimeSpan
 * customEvents
 * settings?
 *
 * +methods
 * setNewCourses
 *
 *
 *
 *
 *
 * external
 * schedulerData
 */
