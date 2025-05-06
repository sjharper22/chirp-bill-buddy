
import { useGroupedSubmission } from "@/hooks/useGroupedSubmission";
import { GroupFilters } from "@/components/group-submission/GroupFilters";
import { BulkActions } from "@/components/group-submission/BulkActions";
import { GroupTable } from "@/components/group-submission/GroupTable";
import { GroupHeader } from "@/components/group-submission/GroupHeader";
import { GroupPreview } from "@/components/group-submission/GroupPreview";
import { CoverLetterDialog } from "@/components/group-submission/cover-letter/CoverLetterDialog";
import { generateCoverSheetHtml } from "@/lib/utils/cover-sheet-generator";

export default function GroupedSubmission() {
  const {
    navigate,
    selectedPatientIds,
    filterStatus,
    setFilterStatus,
    searchTerm,
    setSearchTerm,
    showCoverSheet,
    setShowCoverSheet,
    showCoverLetter,
    setShowCoverLetter,
    coverLetterContent,
    setCoverLetterContent,
    isCoverLetterDialogOpen,
    setIsCoverLetterDialogOpen,
    filteredPatients,
    selectedPatients,
    selectedSuperbills,
    togglePatientSelection,
    clearSelection,
    selectAll,
    handleStatusChange,
    handlePreviewCoverLetter,
    handleDownloadAll
  } = useGroupedSubmission();

  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <GroupHeader 
        selectedPatients={selectedPatients}
        onClearSelection={clearSelection}
        onNavigateBack={() => navigate(-1)}
      />
      
      <GroupFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {selectedPatientIds.length > 0 && (
        <BulkActions
          selectedSuperbills={selectedSuperbills}
          showCoverSheet={showCoverSheet}
          setShowCoverSheet={setShowCoverSheet}
          showCoverLetter={showCoverLetter}
          setShowCoverLetter={setShowCoverLetter}
          handleDownloadAll={handleDownloadAll}
          handlePreviewCoverLetter={handlePreviewCoverLetter}
          generateCoverSheetHtml={(superbills) => {
            return import("@/lib/utils/cover-sheet-generator").then(module => {
              return module.generateCoverSheetHtml(superbills, true);
            });
          }}
        />
      )}
      
      <GroupTable
        filteredPatients={filteredPatients}
        selectedPatientIds={selectedPatientIds}
        togglePatientSelection={togglePatientSelection}
        clearSelection={clearSelection}
        selectAll={selectAll}
        onStatusChange={handleStatusChange}
      />
      
      <GroupPreview 
        showCoverSheet={showCoverSheet}
        showCoverLetter={showCoverLetter}
        selectedSuperbills={selectedSuperbills}
      />
      
      <CoverLetterDialog
        open={isCoverLetterDialogOpen}
        onOpenChange={setIsCoverLetterDialogOpen}
        selectedSuperbills={selectedSuperbills}
        content={coverLetterContent}
        onContentChange={setCoverLetterContent}
      />
    </div>
  );
}
