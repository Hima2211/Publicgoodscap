import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const renderPageButtons = () => {
    const pageButtons = [];
    
    // Determine range of page numbers to show
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    
    // Adjust if we're near the beginning or end
    if (currentPage === 1) {
      endPage = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant="outline"
          className={`
            px-3 py-2 text-sm border-r border-darkBorder
            ${i === currentPage 
              ? 'bg-primary text-white' 
              : 'bg-darkCard text-darkText hover:bg-darkBorder transition-colors'
            }
          `}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }
    
    return pageButtons;
  };
  
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center border border-darkBorder rounded-lg overflow-hidden">
        <Button
          variant="outline"
          className="bg-darkCard px-3 py-2 text-sm border-r border-darkBorder text-darkText"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {renderPageButtons()}
        
        <Button
          variant="outline"
          className="bg-darkCard px-3 py-2 text-sm text-darkText hover:bg-darkBorder transition-colors"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
