import React, { useEffect, useRef, useState } from "react";

// 점의 좌표를 나타내는 인터페이스
interface Point {
  x: number;
  y: number;
}

const FarmShapeDraw = () => {
  // 그려진 점의 목록을 저장하는 상태
  const [points, setPoints] = useState<Point[]>([]);
  // 드래그 중인 점을 저장하는 상태
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  // 다각형을 그리는 모드인지 여부를 나타내는 상태
  const [isDrawing, setIsDrawing] = useState(false);
  // 캔버스 요소에 대한 참조
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 마우스 위치의 좌표값을 저장하는 상태
  const [mouseCoords, setMouseCoords] = useState<Point | null>(null);

  // 캔버스 크기를 조정하는 함수
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      const parentHeight = canvas.parentElement?.clientHeight || 0;
      canvas.width = parentHeight - 20;
      canvas.height = parentHeight - 20;
    }
  };

  // 캔버스를 다시 그리는 함수
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      // 캔버스 초기화
      context.clearRect(0, 0, canvas.width, canvas.height);

      // 좌표 그리드 그리기 - 50x50으로 width, height 비율대로
      context.strokeStyle = "gray";
      context.lineWidth = 0.25;
      const cellWidth = canvas.width / 50;
      const cellHeight = canvas.height / 50;

      for (let i = 0; i <= 50; i++) {
        context.beginPath();
        context.moveTo(i * cellWidth, 0);
        context.lineTo(i * cellWidth, canvas.height);
        context.stroke();

        context.beginPath();
        context.moveTo(0, i * cellHeight);
        context.lineTo(canvas.width, i * cellHeight);
        context.stroke();
      }

      // 그려진 점 그리기
      context.fillStyle = "red";
      points.forEach((point) => {
        context.beginPath();
        context.arc(
          point.x * cellWidth,
          point.y * cellHeight,
          4,
          0,
          2 * Math.PI
        );
        context.fill();
      });

      // 다각형 그리기
      if (points.length > 1) {
        context.strokeStyle = "blue";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(points[0].x * cellWidth, points[0].y * cellHeight);
        for (let i = 1; i < points.length; i++) {
          context.lineTo(points[i].x * cellWidth, points[i].y * cellHeight);
        }
        if (isDrawing) {
          context.lineTo(points[0].x * cellWidth, points[0].y * cellHeight);
        }
        context.stroke();
      }
    }
  };

  // 컴포넌트가 마운트될 때 캔버스 크기를 조정하고 창 크기 변경 이벤트 리스너를 등록
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 컴포넌트가 언마운트될 때 창 크기 변경 이벤트 리스너를 제거
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // points 또는 isDrawing 상태가 변경될 때마다 캔버스를 다시 그림
  useEffect(() => {
    redrawCanvas();
  }, [points, isDrawing]);

  // 캔버스 클릭 핸들러
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = Math.floor((e.clientX - rect.left) / (rect.width / 50));
        const y = Math.floor((e.clientY - rect.top) / (rect.height / 50));
        setPoints([...points, { x, y }]);
        console.log("x: " + x + ", y: " + y);
      }
    }
  };

  // 점 드래그 시작 핸들러
  const handlePointDragStart = (point: Point) => {
    setSelectedPoint(point);
  };

  // 점 드래그 중 핸들러
  const handlePointDragMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedPoint) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = Math.floor((e.clientX - rect.left) / (rect.width / 50));
        const y = Math.floor((e.clientY - rect.top) / (rect.height / 50));
        const updatedPoints = points.map((p) =>
          p === selectedPoint ? { x, y } : p
        );
        setPoints(updatedPoints);
        setMouseCoords({ x, y }); // 드래그 중에도 마우스 위치의 좌표값 업데이트
      }
    }
  };

  // 점 드래그 종료 핸들러
  const handlePointDragEnd = () => {
    setSelectedPoint(null);
  };

  // 다각형 그리기 모드 전환 핸들러
  const handleDrawPolygon = () => {
    setIsDrawing(!isDrawing);
  };

  // 다각형 초기화 핸들러
  const handleResetPolygon = () => {
    setPoints([]);
    setIsDrawing(false);
  };

  // 마우스 이동 시 좌표값 업데이트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = Math.floor((e.clientX - rect.left) / (rect.width / 50));
      const y = Math.floor((e.clientY - rect.top) / (rect.height / 50));
      setMouseCoords({ x, y });
    }
  };

  // 마우스가 캔버스를 벗어났을 때 좌표값 초기화 핸들러
  const handleMouseLeave = () => {
    setMouseCoords(null);
  };

  return (
    <div className="w-full h-full relative">
      {/* 캔버스 요소 */}
      <canvas
        className="bg-green-100"
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={(e) => {
          handleMouseMove(e);
          if (selectedPoint) {
            handlePointDragMove(e);
          }
        }}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handlePointDragEnd}
      ></canvas>
      {/* 그려진 점들 */}
      <div>
        {points.map((point, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${(point.x * 100) / 50}%`,
              top: `${(point.y * 100) / 50}%`,
              width: 10,
              height: 10,
              backgroundColor: "transparent",
              cursor: "move",
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={() => handlePointDragStart(point)}
          />
        ))}
      </div>
      {/* 다각형 그리기 버튼 */}
      <button onClick={handleDrawPolygon}>
        {isDrawing ? "Finish Polygon" : "Draw Polygon"}
      </button>
      {/* 다각형 초기화 버튼 */}
      <button onClick={handleResetPolygon}>Reset</button>
      {/* 마우스 위치의 좌표값 표시 */}
      {mouseCoords && (
        <div
          className="absolute bg-black-100 text-white-100 p-1 rounded-full shadow"
          style={{
            left: `${(mouseCoords.x * 100) / 50}%`,
            top: `${(mouseCoords.y * 100) / 50}%`,
            transform: "translate(10px, -50%)",
          }}
        >
          {mouseCoords.x}, {mouseCoords.y}
        </div>
      )}
    </div>
  );
};

export default FarmShapeDraw;
