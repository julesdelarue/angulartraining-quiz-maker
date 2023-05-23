import {QuizService} from "./quiz.service";
import {TestBed} from "@angular/core/testing";
import {Category} from "./data.models";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(QuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should group categories together if name contains ":" ', () => {
    // GIVEN
    const ungroupedCategories: Category[] = [
      {"id": "9", "name": "General Knowledge"},
      {"id": "10", "name": "Entertainment: Books"},
      {"id": "11", "name": "Entertainment: Film"},
      {"id": "13", "name": "Entertainment: Musicals & Theatres"},
      {"id": "18", "name": "Science: Computers"},
      {"id": "19", "name": "Science: Mathematics"},
      {"id": "20", "name": "Mythology"}
    ]

    // WHEN
    const groupedCategories = service.reduceCategories(ungroupedCategories);

    // THEN
    expect(groupedCategories.length).toBe(4)
    expect(groupedCategories).toEqual([
      {"id": "9", "name": "General Knowledge"},
      {
        "id": "10",
        "name": "Entertainment",
        "subCategories": [
          {"name": "Books", "id": "10"},
          {"name": "Film", "id": "11"},
          {"name": "Musicals & Theatres", "id": "13"}
        ],
      },
      {
        "id": "18",
        "name": "Science",
        "subCategories": [
          {"name": "Computers", "id": "18"},
          {"name": "Mathematics", "id": "19"}
        ],
      },
      {"id": "20", "name": "Mythology"}
    ])
  });
});
