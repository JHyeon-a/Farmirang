"use client";

import { fetchAutoDiary } from "@/api/farm-diary";
import { useEffect, useState } from "react";
import {
  diaryAutosDataType,
  diaryManualDataType,
  diaryTotalDataType,
  fetchAutoDiaryDataType,
} from "@/type/farm-diary";
import { useParams } from "next/navigation";
import AutoDiary from "./AutoDiary";
import MyDiary from "./MyDiary";
import TemperatureComponent from "./TemperatureComponent";
import MyModal from "@/app/_components/common/Modal";
import ImageComponent from "@/app/_components/common/Image";
import Editor from "@/app/_components/common/Editor";

interface ApiResponse {
  data: fetchAutoDiaryDataType;
}

export default function CalendarDate() {
  const [isTrue, setIsTure] = useState<boolean>(false);
  const [currentTemperatue, setCurrentTemperature] = useState<number>(0);
  const [fetchAutoDiaryData, setFetchAutoDiaryData] = useState<
    diaryAutosDataType[]
  >([]);
  const [fetchDiaryTotalData, setFetchDiaryTotalData] =
    useState<diaryTotalDataType>({
      fieldHumidity: "",
      humidity: "",
      temperature: "",
      diaryTotalId: 0,
    });
  const [fetchDiaryManualData, setFetchDiaryManualData] =
    useState<diaryManualDataType>({
      diaryManualId: "",
      content: "",
      photo: "",
    });
  const params = useParams<{ date: string }>();

  const NextFunction = (fetchdata: ApiResponse) => {
    setFetchAutoDiaryData(fetchdata.data.diaryAutos);
    setFetchDiaryTotalData(fetchdata.data.diaryTotal);
    setFetchDiaryManualData(fetchdata.data.diaryManual);
    setCurrentTemperature(Number(fetchdata.data.diaryTotal.temperature));
    if (!fetchdata.data.diaryManual) {
      setIsTure(true);
    }
  };

  useEffect(() => {
    fetchAutoDiary(Number(params?.date))
      .then((res) => {
        NextFunction(res);
      })
      .catch((err) => console.log(err));
  }, [params]);

  return (
    <div className="lg:flex lg:h-full w-full">
      <div className="w-3/5 p-8 ml-8 mt-8">
        <div className="text-h2 font-bold mt-10">심은 작물</div>
        <div className="text-h5 font-semibold mt-4">오늘 작물은요...</div>
        <div className="flex justify-between h-[24rem] w-full">
          <AutoDiary childrenAutoDiaryData={fetchAutoDiaryData} />
        </div>

        <div className="border border-gray-400 shadow-xl rounded-xl mt-10 h-1/3">
          <TemperatureComponent childrenDiaryTotalData={fetchDiaryTotalData} />
        </div>
      </div>
      <div className="w-2/5 p-8 mr-8 mt-8 h-4/5">
        {isTrue ? (
          <div className="h-full flex flex-col justify-center">
            <div className="flex justify-center">
              <MyModal
                buttonText={"일기 추가"}
                buttonBgStyles={
                  "rounded-xl px-10 py-6 border border-black-100 shadow-sm hover:bg-green-100 focus-visible:outline focus-visible:outline-2"
                }
                buttonTextStyles={"font-bold text-h1"}
                Title={"일기 추가"}
                subTitle={""}
                contents={
                  <>
                    <ImageComponent
                      title={"일기 대표 사진"}
                      titlecss={"font-bold text-h5"}
                      topcss={"mt-[2rem] h-[20rem]"}
                      topsecondcss={"w-full"}
                      heightcss={"h-[18rem]"}
                      handleEvent={() => {}}
                    />
                    <div className="font-bold text-h5 mt-10 mb-4">
                      일지 쓰기
                    </div>
                    <Editor />
                  </>
                }
                subTitlecss={""}
                Titlecss={"font-bold text-h2"}
                Modalcss={"w-5/6"}
                Titlebottom={undefined}
                next={"작성"}
              />
            </div>
          </div>
        ) : (
          <MyDiary
            childrenDiaryManualData={fetchDiaryManualData}
            Temperature={currentTemperatue}
          />
        )}
      </div>
    </div>
  );
}
