
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setCurrentProfile, loadUserProfiles } from '../store/selectedProfileSlice';

export const useSelectedProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProfile, allProfiles, loading, error } = useSelector(
    (state: RootState) => state.selectedProfile
  );

  const selectProfile = (profileId: string) => {
    const profile = allProfiles.find(p => p.id === profileId);
    if (profile) {
      dispatch(setCurrentProfile(profile));
    }
  };

  const loadProfiles = () => {
    dispatch(loadUserProfiles());
  };

  return {
    currentProfile,
    allProfiles,
    loading,
    error,
    selectProfile,
    loadProfiles,
    currentProfileId: currentProfile?.id,
  };
};